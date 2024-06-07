<template>
    <div class="container mt-5">
        <h2 class="text-center" style="margin-bottom:30px;">부동산등기 {{ isEdit ? '수정' : '작성' }}</h2>
        <div class="form-box">
            <form @submit.prevent="saveRealreg" style="width:60%">
                <div class="form-row">
                    <div class="form-group col">
                        <label for="requester">구분</label>
                        <input type="text" class="form-control" id="requester" v-model="realreg.requester" required>
                    </div>
                    <div class="form-group col">
                        <label for="division">등기구분</label>
                        <input type="text" class="form-control" id="division" v-model="realreg.division" required>
                    </div>
                    <div class="form-group col">
                        <label for="contract_date">계약일</label>
                        <input type="date" class="form-control" id="contract_date" v-model="realreg.contract_date"
                            required max="9999-12-31">
                    </div>
                    <div class="form-group col">
                        <label for="settlement_date">잔금일</label>
                        <input type="date" class="form-control" id="settlement_date" v-model="realreg.settlement_date"
                            required max="9999-12-31">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col">
                        <label for="sell_price">기준금액</label>
                        <input type="text" class="form-control" id="sell_price" :value="formatNumber(realreg.sell_price)"
                            @input="updateSellPrice" required>
                    </div>
                    <div class="form-group col">
                        <label for="public_price">시가표준액</label>
                        <input type="text" class="form-control" id="public_price"
                            :value="formatNumber(realreg.public_price)" @input="updatePublicPrice" required>
                    </div>
                    <div class="form-group col">
                        <label for="settlement_time">잔금시간</label>
                        <input type="time" class="form-control" id="settlement_time" v-model="realreg.settlement_time"
                            required>
                    </div>
                    <div class="form-group col">
                        <label for="repayment_status">상환</label>
                        <select class="form-control" id="repayment_status" v-model="realreg.repayment_status" required>
                            <option value="">선택하세요</option>
                            <option value="O">상환있음</option>
                            <option value="X">상환없음</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col">
                        <label for="manager">담당자</label>
                        <input type="text" class="form-control" id="manager" v-model="realreg.manager" required>
                    </div>
                    <div class="form-group col">
                        <label for="registration_date">등록일</label>
                        <input type="date" class="form-control" id="registration_date"
                            v-model="realreg.registration_date" required>
                    </div>
                    <div class="form-group col">
                        <label for="manager">감면사항</label>
                        <select class="form-control" id="manager" v-model="realreg.effect" required>
                            <option value="">선택하세요</option>
                            <option value="null">없음</option>
                            <option value="first">생애최초주택</option>
                            <option value="newborn">신생아감면</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="transaction_address">거래주소</label>
                    <input type="text" class="form-control" id="transaction_address" v-model="realreg.transaction_address" required>
                </div>

                <div class="form-group">
                    <label for="memo">참고사항</label>
                    <textarea class="form-control" id="memo" v-model="realreg.memo"></textarea>
                </div>
                <hr>
                <div class="buyer-group">
                    <h5 class="text-center">매도인(등기의무자) 정보</h5>
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="buyer">이름</label>
                            <input type="text" class="form-control" id="buyer" v-model="realreg.buyer" required>
                        </div>
                        <div class="form-group col">
                            <label for="buyer_number">주민번호</label>
                            <input type="text" class="form-control" id="buyer_number" v-model="realreg.buyer_number"
                                required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="buyer_address">주소</label>
                        <input type="text" class="form-control" id="buyer_address" v-model="realreg.buyer_address"
                            required>
                    </div>
                </div>
                <hr>
                <div class="seller-group">
                    <h5 class="text-center" style="margin-bottom:10px;">매도인(등기의무자) 정보</h5>
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="seller">매도인</label>
                            <input type="text" class="form-control" id="seller" v-model="realreg.seller" required>
                        </div>
                        <div class="form-group col">
                            <label for="seller_number">매도인 주민번호</label>
                            <input type="text" class="form-control" id="seller_number" v-model="realreg.seller_number"
                                required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="seller_address">주소</label>
                        <input type="text" class="form-control" id="sellerAddress" v-model="realreg.seller_address"
                            required>
                    </div>
                </div>
                <hr>
                <div class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary mx-1">{{ isEdit ? '수정' : '작성' }}</button>
                    <button type="button" class="btn btn-secondary mx-1" @click="goBack">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    props: ['realreg_id'],
    data() {
        return {
            isEdit: false,
            realreg: {
                requester: '',
                division: '',
                registrationDate: new Date().toISOString().substr(0, 10), // 오늘 날짜로 기본값 설정
                contract_date: '',
                settlement_date: '',
                settlement_time: '',
                repayment_status: '',
                sell_price: '',
                public_price: '',
                transaction_address: '',
                buyer: '',
                buyer_number: '',
                buyer_address: '',
                manager: '',
                effect: '',
                seller: '',
                seller_number: '',
                seller_address: '',
                memo: '',
            }
        };
    },
    created() {
        if (this.$route.params.isEdit) {
            this.isEdit = true;
            console.log(this.$route.params.realreg_id);
            this.loadRealregbyid(this.$route.params.realreg_id);
        }
    },
    methods: {
        async loadRealregbyid(realreg_id) {
            try {
                const response = await axios.get(`/api/realregs/${realreg_id}`);
                this.realreg = response.data;
            } catch (error) {
                console.error('부동산 등기정보를 불러오는 중에 오류가 발생했습니다:', error);
            }
        },
        formatNumber(value) {
            if (value === undefined || value === null) {
                return '';
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        parseNumber(value) {
            return parseInt(value.replace(/,/g, ''), 10);
        },
        updateSellPrice(event) {
            const value = this.parseNumber(event.target.value);
            this.realreg.sell_price = isNaN(value) ? 0 : value;
        },
        updatePublicPrice(event) {
            const value = this.parseNumber(event.target.value);
            this.realreg.public_price = isNaN(value) ? 0 : value;
        },
        async saveRealreg() {
            try {
                let response;
                if (this.isEdit) {
                    // Update existing realreg
                    response = await axios.put(`/api/realregs/${this.realreg.realreg_id}`, this.realreg);
                    if (response.status === 200) {
                        alert('부동산등기 수정 완료');
                    } else {
                        alert('부동산등기 수정 실패');
                    }
                } else {
                    // Create new realreg
                    response = await axios.post('/api/realregs', this.realreg);
                    if (response.status === 201) {
                        alert('부동산등기 작성 완료');
                    } else {
                        alert('부동산등기 작성 실패');
                    }
                }
                const realreg_id = this.isEdit ? this.realreg.realreg_id : response.data.realreg_id;
                this.$router.push({ name: 'RealRegDetail', params: { realreg_id } });
            } catch (error) {
                console.error('Error saving realreg:', error);
                alert('부동산등기 저장 중 오류가 발생했습니다.');
            }
        },
        goBack() {
            this.$router.go(-1);
        }
    },
};
</script>

<style scoped>
.form-box {
    padding: 50px 0px 50px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50px;
    background-color: #fbfbfb;
}

.buyer-group {
    margin-top: 30px;
}

.seller-group {
    margin-top: 30px;
}

.form-row {
    display: flex;
}

.col {
    padding: 5px;
}

.form-group {
    margin-bottom: 5px;
    padding: 0 5px 0 5px;
}

hr {
    margin: 30px 0 30px 0;
}
</style>
