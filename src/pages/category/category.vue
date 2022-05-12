<template>
	<view class="rf-category">
			<view class="uni-form-item uni-column">
				<view class="title">请输入产品名称</view>
				<input class="uni-input" ref="input1"  @input="inputName" placeholder="产品名称" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">请输入产品数量</view>
				<input class="uni-input" type="number" placeholder="产品数量" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">请输入供货单位</view>
				<input class="uni-input" type="number" placeholder="供货单位" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">请选择到货时间</view>
				<picker mode="date" :value="date"  @change="bindDateChange">
					<view class="uni-input">{{date}}</view>
				</picker>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">请选择到货状态</view>
				<view>
					<switch checked @change="switchChange" />
				</view>
			</view>
			<button  @click="handleSumbit">提交</button>
	</view>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
	components: {

	},
	data() {
		return {
        value:'',
				date: '',
		};
	},
	computed: {

	},
	filters: {
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}w`;
			}
			return val;
		}
	},
	// 每次页面显示 执行该方法
	onLoad() {
		this.initData();
	},
	methods: {
    ...mapMutations(['setCartNum']),

    inputName(){

		},
		switchChange(){

		},
		bindDateChange(){

		},
		handleSumbit(){

		},
		// 获取产品详情
		async getProductDetail(row) {
			// await this.$http
			// 	.get(`${productDetail}`, {
			// 		id: row.id
			// 	})
			// 	.then(async r => {
			// 		this.productDetail = r.data;
			// 		this.specClass = 'show';
			// 	});
		},
		// 跳转至商品列表
		navTo(route) {
			// this.$mRouter.push({ route });
		},
		// 数据初始化
		async initData() {

		},
		// 跳转至搜索详情页
		toSearch() {
			// this.$mRouter.push({
			// 	route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
			// });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: #f6f8fa;
}
.rf-category {
	background-color: #f6f8fa;
	/*  #ifdef  APP-PLUS  */
	margin-top: calc(20upx + var(--status-bar-height));
	/*  #endif  */
	/*模块分类*/
	.uni-input {
		border: solid 1px #999999;
		height: 30px;
	}
	.uni-form-item  {
		margin-top: 14px;;
	}
	button{
		margin-top: 50px;
		background-color: #fa436a;
	}
	input{
		border-radius: 8px;
	}
}
</style>
