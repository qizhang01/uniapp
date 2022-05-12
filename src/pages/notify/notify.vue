<template>
	<view class="notify">
		<uni-table ref="table"  :loading="loading" border stripe  emptyText="暂无更多数据" >
			<uni-tr class="uni-table-minwidth">
				<uni-th width="80" align="center">名称</uni-th>
				<uni-th width="80" align="center">供货单位</uni-th>
				<uni-th width="100" align="center">到货日期</uni-th>
				<uni-th width="80" align="center">操作</uni-th>
			</uni-tr>
			<uni-tr class="uni-table-minwidth" v-for="(item, index) in tableData" :key="index">
				<uni-td>{{ item.name }}</uni-td>
				<uni-td>
					<view class="name">{{ item.corporation }}</view>
				</uni-td>
				<uni-td align="center">{{ item.date }}</uni-td>
				<uni-td>
					<view class="uni-group">
						<button class="uni-button" size="mini" type="primary">修改</button>
						<button class="uni-button" size="mini" type="warn">删除</button>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>
		<view class="uni-pagination-box"><uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" /></view>
	</view>
</template>
<script>
import tableData from '@/config/productList.config.js'
import { mapMutations } from 'vuex';
export default {
  components: {  },
	data() {
		return {
            tableData,
			loading: true,
						// 每页数据量
			pageSize: 10,
			// 当前页
			pageCurrent: 1,
			// 数据总量
			total: 0,
			loading: false
		};
	},

	onShow() {
	
	},

	methods: {
		...mapMutations(['setNotifyNum']),
		// 数据初始化
        selectionChange(){

		},

	}
};
</script>
<style lang="scss">
.notify{
    .uni-button{
		height: 24px;
		line-height: 2;
	}
	.uni-pagination-box {
		margin-top: 10px;
	}
}	
</style>
