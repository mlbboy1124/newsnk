<template>
  <div class="container">
    <h3>신청법무사 선택</h3>
    <select v-model="selectedNotary" class="form-control">
      <option v-for="notary in notaries" :key="notary.id" :value="notary">
        {{ notary.name }}
      </option>
    </select>
    <hr>
    <h3>서류 다운로드</h3>
    <div class="d-flex justify-content-end">
    <button class="btn btn-outline-secondary mx-1" style="margin-bottom: 10px;" type="button" @click="toggleSelectAll">
          {{ allSelected ? '선택 해제' : '전체 선택' }}
        </button>
      </div>
    <form @submit.prevent="processDocx">
      <div v-for="(option, index) in options" :key="index" class="checkbox-card" :class="{ checked: option.checked }">
        <input type="checkbox" v-model="option.checked" :id="'option' + index" class="custom-checkbox">
        <label :for="'option' + index" class="custom-label">
          <div class="card-content">
            <div class="card-text">
              <div class="card-title">{{ option.label }}</div>
            </div>
            <div class="card-check">
              <i v-if="option.checked" class="bi bi-check-circle-fill"></i>
            </div>
          </div>
        </label>
      </div>
      <div class="text-center" style="margin-top:10px; margin-bottom:10px">
        <button class="btn btn-outline-primary mx-1" type="submit">개별 다운로드</button>
        <button class="btn btn-outline-primary mx-1" type="button" @click="downloadZip">압축 다운로드</button>
        <!-- <b-button variant="outline-success mx-1" @click="resetForm">초기화</b-button> -->
        <b-button variant="outline-danger mx-1" @click="closeForm">닫기</b-button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '@/axios';
import { ref, onMounted } from 'vue';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default {
  props: ['realreg_id'],
  name: 'RealRegDocument',
  setup(props) {
    const options = ref([
      { label: '체크리스트', checked: true, file: 'checkList.docx' },
      { label: '자필서명정보', checked: true, file: 'sign_check.docx' },
      { label: '취득세 신고서', checked: true, file: 'template.docx' },
      { label: '생애최초주택감면 신청서', checked: true, file: 'first_house.docx' },
      { label: '확인서면', checked: true, file: 'checkDoc.docx' },
      // Add more options here as needed
    ]);

    const notaries = ref([]);
    const selectedNotary = ref(null);
    const office = ref([]);
    const allSelected = ref(true);

     

    onMounted(async () => {
      try {
        const responseuserinfo = await axios.get(`/api/user/me`);
        const officeId = responseuserinfo.data.office_id;
        const responseNotaries = await axios.get(`/api/users`, {
          params: {
            role: '법무사',
            office_id: officeId
          }
        });

        notaries.value = responseNotaries.data;
        office.value = responseuserinfo.data.office;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('ko-KR').format(value);
    };

    const uniqueAddresses = (addresses) => {
      const uniqueSet = new Set(addresses);
      return Array.from(uniqueSet).join(', ');
    };

    const processDocx = async () => {
      if (!selectedNotary.value) {
        alert('법무사를 선택하세요.');
        return;
      }

      const selectedOptions = options.value.filter(option => option.checked);

      if (selectedOptions.length === 0) {
        alert('하나 이상의 옵션을 선택하세요.');
        return;
      }

      try {
        const response = await axios.get(`/api/realregs/${props.realreg_id}`);
        const data = response.data;
        const buyertable = [...data.buyers];
        const commonTemplateData = {
          transaction_address: data.transaction_address,
          settlement_date: data.settlement_date,
          contract_date: data.contract_date,
          sell_price: formatCurrency(data.sell_price),
          realestate_view: data.realestate_view,
          buyersName: data.buyers.map(b => b.name).join(', '),
          buyersNumber: data.buyers.map(b => b.number).join(', '),
          buyersAddress: uniqueAddresses(data.buyers.map(b => b.address)),
          sellersName: data.sellers.map(s => s.name).join(', '),
          sellersNumber: data.sellers.map(s => s.number).join(', '),
          sellersAddress: uniqueAddresses(data.sellers.map(s => s.address)),
          buyers: data.buyers,
          sellers: data.sellers,
          submitTax: formatCurrency(data.submitTax),
          eduTax: formatCurrency(data.eduTax),
          ruralTax: formatCurrency(data.ruralTax),
          totalTax: formatCurrency(data.submitTax + data.eduTax + data.ruralTax),
          firstbuyer: data.buyers.length > 0 ? buyertable.shift() : null,
          leftbuyers: data.buyers.length > 1 ? buyertable : [],
          manager: data.manager,
          notaryName: selectedNotary.value.name,
          notaryNumber : selectedNotary.value.number,
          notaryPhone: office.value.phone,
          notaryAddress: office.value.address,
        };

        for (const option of selectedOptions) {
          if (option.file === 'sign_check.docx' || option.file === 'checkDoc.docx') {
            for (const seller of data.sellers) {
              const templateData = {
                ...commonTemplateData,
                sellerName: seller.name,
                sellerNumber: seller.number,
                sellerAddress: seller.address,
              };

              await generateAndSaveDocx(option.file, `${option.label}_${seller.name}.docx`, templateData);
            }
          } else {
            await generateAndSaveDocx(option.file, `${option.label}.docx`, commonTemplateData);
          }
        }
      } catch (error) {
        console.error('Error fetching the template:', error);
      }
    };

    const generateAndSaveDocx = async (templateFile, outputFileName, data) => {
      const content = await generateDocxContent(templateFile, data);
      if (content) {
        saveAs(content, outputFileName);
      }
    };

    const downloadZip = async () => {
      if (!selectedNotary.value) {
        alert('법무사를 선택하세요.');
        return;
      }

      const selectedOptions = options.value.filter(option => option.checked);

      if (selectedOptions.length === 0) {
        alert('하나 이상의 옵션을 선택하세요.');
        return;
      }

      try {
        const response = await axios.get(`/api/realregs/${props.realreg_id}`);
        const data = response.data;
        const buyertable = [...data.buyers];

        const commonTemplateData = {
          transaction_address: data.transaction_address,
          settlement_date: data.settlement_date,
          contract_date: data.contract_date,
          sell_price: formatCurrency(data.sell_price),
          realestate_view: data.realestate_view,
          buyersName: data.buyers.map(b => b.name).join(', '),
          buyersNumber: data.buyers.map(b => b.number).join(', '),
          buyersAddress: uniqueAddresses(data.buyers.map(b => b.address)),
          sellersName: data.sellers.map(s => s.name).join(', '),
          sellersNumber: data.sellers.map(s => s.number).join(', '),
          sellersAddress: uniqueAddresses(data.sellers.map(s => s.address)),
          buyers: data.buyers,
          sellers: data.sellers,
          submitTax: formatCurrency(data.submitTax),
          eduTax: formatCurrency(data.eduTax),
          ruralTax: formatCurrency(data.ruralTax),
          totalTax: formatCurrency(data.submitTax + data.eduTax + data.ruralTax),
          firstbuyer: data.buyers.length > 0 ? buyertable.shift() : null,
          leftbuyers: data.buyers.length > 1 ? buyertable : [],
          manager: data.manager,
          notaryName: selectedNotary.value.name,
          notaryNumber : selectedNotary.value.number,
          notaryPhone: office.value.phone,
          notaryAddress: office.value.address,
        };

        const zip = new JSZip();

        for (const option of selectedOptions) {
          if (option.file === 'sign_check.docx' || option.file === 'checkDoc.docx') {
            for (const seller of data.sellers) {
              const templateData = {
                ...commonTemplateData,
                sellerName: seller.name,
                sellerNumber: seller.number,
                sellerAddress: seller.address,
              };

              const content = await generateDocxContent(option.file, templateData);
              zip.file(`${option.label}_${seller.name}.docx`, content);
            }
          } else {
            const content = await generateDocxContent(option.file, commonTemplateData);
            zip.file(`${option.label}.docx`, content);
          }
        }

        zip.generateAsync({ type: 'blob' })
          .then((blob) => {
            saveAs(blob, 'documents.zip');
          });
      } catch (error) {
        console.error('Error fetching the template:', error);
      }
    };

    const generateDocxContent = async (templateFile, data) => {
      const fileResponse = await fetch(`/Templates/${templateFile}`);
      if (!fileResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const content = await fileResponse.arrayBuffer();

      const zipFile = new PizZip(content);
      const doc = new Docxtemplater(zipFile, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.setData(data);

      try {
        doc.render();
      } catch (error) {
        console.error('Error rendering the document:', error);
        return null;
      }

      return doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
    };

    const toggleSelectAll = () => {
      allSelected.value = !allSelected.value;
      options.value.forEach(option => {
        option.checked = allSelected.value;
      });
    };

    return {
      options,
      processDocx,
      downloadZip,
      notaries,
      selectedNotary,
      office,
      toggleSelectAll,
      allSelected
    };
  },
  methods: {
    closeForm() {
      window.close();
    },
    
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 700px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

.checkbox-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  margin-left:50px;
  margin-right:50px;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: white;
  transition: border-color 0.3s, background-color 0.3s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.checkbox-card.checked {
  border-color: #007bff;
  border-width: 2px;
  background-color: #e6eaff;
  
}

.custom-checkbox {
  display: none;
}

.custom-label {
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.card-content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.card-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.card-text {
  flex-grow: 1;
}

.card-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.card-subtitle {
  color: #666;
  font-size: 14px;
}

.card-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  transition: background-color 0.3s, border-color 0.3s;
}

.custom-checkbox:checked + .custom-label .checkbox-card {
  border-color: #007bff;
  background-color: #e6f7ff;
}

.custom-checkbox:checked + .custom-label .card-check {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.custom-checkbox:checked + .custom-label .bi-check-circle-fill {
  display: block;
}

.bi-check-circle-fill {
  display: none;
  font-size: 24px;
}
</style>
