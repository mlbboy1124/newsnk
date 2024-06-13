<template>
    <div class="scale-down">
        <h2 class="text-center my-4">작성된 영수증 목록</h2>
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th class="text-center date-column">작성일</th>
                        <th class="text-center">잔금일</th>
                        <th class="text-center">의뢰인</th>
                        <th class="text-center">구분</th>
                        <th class="text-center">등기구분</th>
                        <th class="text-center">합계금액</th>
                        <th class="text-center delete-column"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="receipt in filteredReceipts" :key="receipt.id">
                        <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ receipt.createdAt }}</td>
                        <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ realreg.settlement_date }}
                        </td>
                        <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ buyerInfo.names }}</td>
                        <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ realreg.requester }}</td>
                        <td @click="loadReceipt(receipt)" class="text-center ellipsis">{{ realreg.division }}</td>
                        <td @click="loadReceipt(receipt)" class="text-right ellipsis">{{
                            formattedValue(receipt.totalAmount) }}원
                        </td>
                        <td class="text-center delete-column">
                            <b-button class="btn-sm mx-1" variant="outline-danger"
                                @click.stop="deleteReceipt(receipt.receipt_id)">삭제</b-button>
                            <b-button class="btn-sm mx-1" variant="outline-primary"
                                @click.stop="navigateToReport(receipt.receipt_id)">인쇄</b-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2 class="text-center my-4">영수증 작성</h2>
        <div class="table-responsive">
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <th class="text-center">의뢰인</th>
                        <td>{{ buyerInfo.names }}</td>
                        <th class="text-center">등기구분</th>
                        <td>{{ realreg.division }}</td>

                    </tr>
                    <tr>
                        <th class="text-center">담당자</th>
                        <td>{{ realreg.manager }}</td>
                        <th class="text-center">잔금일</th>
                        <td>{{ realreg.settlement_date }}</td>
                    </tr>
                    <tr>
                        <th class="text-center">기준금액</th>
                        <td>{{ formattedValue(realreg.sell_price) }}</td>
                        <th class="text-center">감면해당</th>
                        <td>{{ effectDisplay }}</td>
                    </tr>
                    <tr>
                        <th class="text-center">거래주소</th>
                        <td colspan="3">{{ realreg.transaction_address }}</td>
                    </tr>
                    <tr>
                        <th class="text-center">참고사항</th>
                        <td colspan="3">
                            <textarea v-model="realreg.memo" class="form-control notes-textarea"></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 class="text-center my-4">비용내역서</h3>
        <div class="table-responsive">
            <table class="table table-bordered fixed-width">
                <thead>
                    <tr>
                        <th colspan="2" class="text-center">공과금</th>
                        <th colspan="2" class="text-center">보수료</th>
                        <th class="text-center delete-column"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th class="text-center">항목</th>
                        <th class="text-center">금액</th>
                        <th class="text-center">항목</th>
                        <th class="text-center">금액</th>
                        <th></th>
                    </tr>
                    <tr v-for="index in maxItems" :key="index">
                        <td><input v-model="getExpense(expensesLeft, index - 1).name"
                                class="form-control input-fixed" /></td>
                        <td><input :value="formattedAmount(expensesLeft, index - 1)"
                                @input="updateAmount($event, expensesLeft, index - 1)" class="form-control input-fixed"
                                type="text" />
                        </td>
                        <td><input v-model="getExpense(expensesRight, index - 1).name"
                                class="form-control input-fixed" /></td>
                        <td><input :value="formattedAmount(expensesRight, index - 1)"
                                @input="updateAmount($event, expensesRight, index - 1)" class="form-control input-fixed"
                                type="text" />
                        </td>
                        <td class="text-center">
                            <b-button class="btn-sm" variant="outline-danger" @click="removeExpenseItem(index - 1)"
                                :disabled="disableRemoveButton">삭제</b-button>
                        </td>
                    </tr>
                    <tr>
                        <th colspan="2"></th>
                        <th class="text-center">부가세</th>
                        <th class="text-center">{{ formattedValue(VAT) }}원</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th class="text-center">공과금 소계</th>
                        <th class="text-center">{{ formattedValue(LeftAmount) }}원</th>
                        <th class="text-center">보수료 소계</th>
                        <th class="text-center">{{ formattedValue(rightAmount) }}원</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th colspan="2" class="text-center">합계</th>
                        <th colspan="2" class="text-center">{{ formattedValue(totalAmount + VAT) }}원</th>
                        <th></th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-center my-4">
            <b-button variant="outline-primary mx-1" @click="addExpenseItem">항목 추가</b-button>
            <b-button variant="outline-secondary mx-1" @click="resetForm">초기화</b-button>
            <b-button variant="outline-success mx-1" @click="saveReceipt">저장</b-button>
            <b-button variant="outline-danger mx-1" @click="closeForm">닫기</b-button>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    props: ['realreg_id'],
    data() {
        return {
            realreg: {
                requester: '',
                division: '',
                buyers: [],
                manager: '',
                settlement_date: '',
                sell_price: '',
                memo: '',
                submitTax: '',
                eduTax: '',
                ruralTax: '',
            },
            expensesLeft: [
                { name: '등록면허세 및 취득세', amount: 0 },
                { name: '교육세', amount: 0 },
                { name: '농특세', amount: 0 },
                { name: '등기신청수수료', amount: 13000 },
                { name: '국민주택채권', amount: 0 },
                { name: '인지세', amount: 0 },
                { name: '우편 및 등제증명', amount: 20000 },
            ],
            expensesRight: [
                { name: '기본보수', amount: 0 },
                { name: '교통비', amount: 0 },
                { name: '서류작성비', amount: 0 },
                { name: '일당', amount: 0 },
                { name: '', amount: 0 },
                { name: '', amount: 0 },
            ],
            createdAt: '',
            notes: '',
            receipts: []

        };
    },
    computed: {
        buyerInfo() {
            if (!this.realreg) return { names: '', numbers: '', addresses: '' };
            return {
                names: this.realreg.buyers.map(buyer => buyer.name).join(', '),
                numbers: this.realreg.buyers.map(buyer => buyer.number).join(', '),
                addresses: this.realreg.buyers.map(buyer => buyer.address).join(', ')
            };
        },
        maxItems() {
            return Math.max(this.expensesLeft.length, this.expensesRight.length);
        },
        rightAmount() {
            const rightSum = this.expensesRight.reduce((sum, item) => sum + (item.amount || 0), 0);
            return rightSum;
        },
        VAT() {
            const rightSum = this.rightAmount;
            return Math.floor(rightSum * 0.1);
        },
        LeftAmount() {
            const leftSum = this.expensesLeft.reduce((sum, item) => sum + (item.amount || 0), 0);
            return leftSum;
        },
        totalAmount() {
            const leftSum = this.LeftAmount;
            const rightSum = this.rightAmount;
            return leftSum + rightSum;
        },
        disableRemoveButton() {
            return this.expensesLeft.length <= 6 && this.expensesRight.length <= 6;
        },
        effectDisplay() {
            if (!this.realreg) return '';
            switch (this.realreg.effect) {
                case 'null':
                    return '없음';
                case 'first':
                    return '생애최초취득감면';
                case 'newborn':
                    return '신생아감면';
                default:
                    return this.realreg.effect;
            }
        },
        filteredReceipts() {
            // 작성일을 기준으로 정렬 (오름차순)
            return this.receipts
                .filter(receipt => receipt.lawsuit_id === this.index)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    },
    created() {
        this.fetchRealreg();
        this.fetchReceipts();
    },
    methods: {
        fetchRealreg() {
            axios.get(`/api/realregs/${this.realreg_id}`)
                .then(response => {
                    this.realreg = response.data;
                    // realreg 값을 기반으로 expensesLeft 업데이트
                    const taxMapping = {
                        '등록면허세 및 취득세': isNaN(parseInt(this.realreg.submitTax, 10)) ? 0 : parseInt(this.realreg.submitTax, 10),
                        '교육세': isNaN(parseInt(this.realreg.eduTax, 10)) ? 0 : parseInt(this.realreg.eduTax, 10),
                        '농특세': isNaN(parseInt(this.realreg.ruralTax, 10)) ? 0 : parseInt(this.realreg.ruralTax, 10),
                    };

                    this.expensesLeft = this.expensesLeft.map(expense => {
                        if (taxMapping[expense.name] !== undefined) {
                            return {
                                ...expense,
                                amount: taxMapping[expense.name]
                            };
                        }
                        return expense;
                    });
                })
                .catch(error => {
                    console.error('부동산 등기정보를 불러오는 중에 오류가 발생했습니다:', error);
                });
        },
        fetchReceipts() {
            axios.get(`/api/realregs/receipts/${this.realreg_id}`)
                .then(response => {
                    this.receipts = response.data;
                })
                .catch(error => {
                    console.error('영수증 목록을 불러오는 중에 오류가 발생했습니다:', error);
                });
        },
        addExpenseItem() {
            this.expensesLeft.push({ name: '', amount: 0 });
            this.expensesRight.push({ name: '', amount: 0 });
        },
        removeExpenseItem(index) {
            if (this.expensesLeft.length > 6) {
                this.expensesLeft.splice(index, 1);
            }
            if (this.expensesRight.length > 6) {
                this.expensesRight.splice(index, 1);
            }
        },
        getExpense(array, index) {
            if (!array[index]) {
                array[index] = { name: '', amount: 0 };
            }
            return array[index];
        },
        formattedAmount(array, index) {
            const value = array[index] ? array[index].amount : 0;
            return new Intl.NumberFormat().format(value);
        },
        updateAmount(event, array, index) {
            const value = event.target.value.replace(/,/g, '');
            array[index].amount = parseInt(value, 10) || 0;
        },
        formattedValue(value) {
            return new Intl.NumberFormat().format(value);
        },
        saveReceipt() {
            const data = {
                realreg_id: this.realreg.realreg_id,
                expensesLeft: this.expensesLeft.map(expense => ({
                    ...expense,
                    amount: expense.amount === 0 ? null : expense.amount
                })),
                expensesRight: this.expensesRight.map(expense => ({
                    ...expense,
                    amount: expense.amount === 0 ? null : expense.amount
                })),
                VAT: this.VAT,
                LeftAmount: this.LeftAmount,
                rightAmount: this.rightAmount,
                totalAmount: this.totalAmount + this.VAT,
                notes: this.realreg.memo === '' ? null : this.realreg.memo, // 비어있으면 null로 저장
            };
            axios.post('/api/realregs/receipt/save', data)
                .then(() => {
                    this.fetchReceipts();
                    this.resetForm(); // 폼 초기화
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // 저장 후 페이지 맨위로 스크롤
                })
                .catch(error => {
                    console.error('영수증 저장 중 오류가 발생했습니다:', error);
                });
        },
        deleteReceipt(receipt_id) {
            axios.delete(`/api/realregs/receipts/${receipt_id}`)
                .then(() => {
                    this.fetchReceipts();
                })
                .catch(error => {
                    console.error('영수증 삭제 중 오류가 발생했습니다:', error);
                });
        },
        navigateToReport(receipt_id) {
            const url = this.$router.resolve({ name: 'RealRegReceiptReport', params: { receipt_id } }).href;
            const newWindowName = `newwindow-${receipt_id}`;
            window.open(url, newWindowName, 'width=1050,height=800');
        },
        loadReceipt(receipt) {
            this.expensesLeft = receipt.expensesLeft.map(expense => ({
                ...expense,
                amount: expense.amount === null ? 0 : expense.amount
            }));
            this.expensesRight = receipt.expensesRight.map(expense => ({
                ...expense,
                amount: expense.amount === null ? 0 : expense.amount
            }));
            this.notes = receipt.notes; // 저장된 참고사항 불러오기
        },

        resetForm() {
            this.expensesLeft = [
                { name: '등록면허세 및 취득세', amount: 0 },
                { name: '교육세', amount: 0 },
                { name: '농특세', amount: 0 },
                { name: '등기신청수수료', amount: 13000 },
                { name: '국민주택채권', amount: 0 },
                { name: '인지세', amount: 0 },
                { name: '우편 및 등제증명', amount: 20000 },
            ];
            this.expensesRight = [
                { name: '기본보수', amount: 0 },
                { name: '교통비', amount: 0 },
                { name: '서류작성비', amount: 0 },
                { name: '일당', amount: 0 },
                { name: '', amount: 0 },
                { name: '', amount: 0 },
            ];
            const taxMapping = {
                '등록면허세 및 취득세': parseInt(this.realreg.submitTax, 10),
                '교육세': parseInt(this.realreg.eduTax, 10),
                '농특세': parseInt(this.realreg.ruralTax, 10)
            };

            this.expensesLeft = this.expensesLeft.map(expense => {
                if (taxMapping[expense.name] !== undefined) {
                    return {
                        ...expense,
                        amount: taxMapping[expense.name]
                    };
                }
                return expense;
            });
        },
        closeForm() {
            window.close();
        }
    },
};
</script>

<style scoped>
.table-responsive {
    margin-bottom: 20px;
}

.table {
    table-layout: fixed;
    max-width: 1000px;
}

.table th,
.table td {
    word-wrap: break-word;
    cursor: pointer;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    background: none;
}

.input-fixed {
    width: 100%;
}

.scale-down {
    transform: scale(0.9);
    transform-origin: top center;
}

h2 {
    max-width: 1000px;
}

h3 {
    max-width: 1000px;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}

.delete-column {
    width: 120px;
    /* 원하는 너비로 설정 */
}

.date-column {
    width: 150px;
    /* 원하는 너비로 설정 */
}

.table-hover tbody tr:hover {
    background-color: rgba(51, 80, 176, 0.1) !important;
}

.thead-dark th {
    background-color: #3384d4;
    color: white;
}

.text-right {
    text-align: right;
}

.text-left {
    text-align: left;
}

.text-center {
    text-align: center;
}

.notes-textarea {
    height: 50px;
    /* 참고사항 칸 높이 설정 */
}

/* Ellipsis styling */
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>