<template>
	<view class="rf-index">
		<!--搜索导航栏-->
		<rf-search-bar
			@search="navToSearch"
			title="扫一扫"
			icon="iconsaomiao"
			@tab="tabClick"
			:categoryList="categoryList"
			:placeholder="请输入关键字"
		/>
		<view :style="{
			paddingTop: merchantShow ? (isOpenIndexCate ? 134 + statusBar + 'px' : 85 + statusBar + 'px' )  : (isOpenIndexCate ? 98 + statusBar + 'px' : 55 + statusBar + 'px' )
		}">

			<block v-if="currentCate === 0">
				<!-- 轮播图1 -->
				<view class="swiper">
					<view class="swiper-box">
						<rf-swipe-dot
							:info="myCarouselList"
							mode="nav"
							:current="current"
							field="title"
						>
							<swiper @change="handleDotChange" autoplay="true">
								<swiper-item
									v-for="(item, index) in myCarouselList"
									:key="index"
								>
									<view class="swiper-item">
										<image :src="item.cover" mode="aspectFill" />
									</view>
								</swiper-item>
							</swiper>
						</rf-swipe-dot>
					</view>
				</view>

				<!--新闻通知-->
				<rf-swiper-slide v-if="announceList.length > 0" :list="announceList" class="rf-skeleton" @navTo="navTo('/pages/index/notice/notice')">
					<view slot="header" class="swiper-slide-header">
						<text class="iconfont icongonggao" :class="'text-'+themeColor.name"></text>
					</view>
				</rf-swiper-slide>

				<!--新品上市-->
				<rf-floor-index
					icon="iconxinpin2"
					:list="newProductList"
					@toBanner="indexTopToDetailPage"
					@toList="
					navTo(`/pages/product/list?param=${JSON.stringify({ is_new: 1 })}`)
				"
					:header="{ title: '在库商品', desc: '还有库存商品' }"
					@detail="navToDetailPage"
				/>
			</block>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<rf-back-home></rf-back-home>
	</view>
</template>
<script>
	import {
		indexList,
	} from '@/api/product';
	import rfSwipeDot from '@/components/rf-swipe-dot';
	import rfFloorIndex from '@/components/rf-floor-index';
	import rfSearchBar from '@/components/rf-search-bar';
	import rfSwiperSlide from '@/components/rf-swiper-slide';
	import listCell from '@/components/rf-list-cell';
	import myCarouselList from '@/config/myCarouselList.config.js'
	import productList from '@/config/productList.config.js'
	import { mapMutations } from 'vuex';
	const announceList = [{
		cover: "",
		created_at: "1647177055",
		id: "3332",
		synopsis: "",
		title: "测试消息",
		view: "0"
	},{
		cover: "",
		created_at: "1647177080",
		id: "333",
		synopsis: "",
		title: "第2条消息",
		view: "10"
	}]
	export default {
		components: {
			rfFloorIndex,
			rfSwipeDot,
			rfSearchBar,
			listCell,
			rfSwiperSlide
		},
		data() {
			return {
				current: 0, // 轮播图index
				myCarouselList,
				categoryList: [{ id: 0, title: '首页' }, {id: 1, title: '预留功能'}],
				announceList,
				newProductList: productList, // 新品上市商品列表
				share: {},
				loading: true,
				scrollTop: 0,
				kefuShow: true,
				loadingType: 'more',
				appName: this.$mSettingConfig.appName,
				page: 1,
				currentCate: 0,
				isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onShow() {
            this.loading = false;
		},
		computed: {
			statusBar () {
				const e = uni.getSystemInfoSync();
				return e.statusBarHeight;
			},
			// 计算倒计时时间
			second() {
				return function(val) {
					return Math.floor(15 * 60 - (new Date() / 1000 - val));
				};
			},
			bottom () {
				let bottom = 0;
				/*  #ifdef H5  */
				bottom = 90;
				/*  #endif */
				return bottom;
			},
		},
		onShareAppMessage() {
			let shareParams = { title: this.share.share_title || `欢迎来到${this.appName}`, path: '/pages/index/index' };
			return shareParams;
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.getIndexList('refresh');
		},
		// 加载更多
		onReachBottom() {
			if (this.currentCate === 0) return;
			if (this.loadingType === 'nomore') return;
			this.page++;
		},
		methods: {
			// 顶部tab点击
			tabClick({ id }) {
				this.currentCate = id;
				if (id === 0) return;
				this.loading = true;
				this.page = 1;
			},
			...mapMutations(['setCartNum']),
			// 监听轮播图切换
			handleDotChange(e) {
				this.current = e.detail.current;
			},
			// 数据初始化
			initData() {
				// 设置购物车数量角标
				this.getIndexList();
			},
			// 通用跳转
			navTo(route) {
				this.$mRouter.push({ route });
			},

			// 通用跳转
			navToSearch() {
				this.$mRouter.push({
					route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
				});
			},
			// 跳至广告图指定页面
			indexTopToDetailPage(item) {
				this.$mHelper.handleBannerNavTo(item.jump_type, item.jump_link, item.id);
			},
			// 获取主页数据
			async getIndexList(type) {
				await this.$http
					.get(`${indexList}`, {})
					.then(async r => {
						uni.setNavigationBarTitle({ title: this.appName });
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						// 首页参数赋值
						this.initIndexData(r.data);
						this.loading = false;
					})
					.catch(() => {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
					});
			},
			// 首页参数赋值
			initIndexData(data) {
				this.announceList = data.announce;
				this.categoryList = [{ id: 0, title: '首页' }, {id: 1, title: '预留功能'}];
				this.search = data.search;
				this.share = data.share;
				this.config = data.config;
				this.$mHelper.handleWxH5Share(this.share.share_title || this.appName, this.share.share_desc || `欢迎来到${this.appName}商城`, this.share.share_link || this.$mConfig.hostUrl, this.share.share_cover || this.$mSettingConfig.appLogo);
			},
			// 跳转至商品详情页
			navToDetailPage(data) {
	
			},
	
		}
	};
</script>
<style lang="scss">
	page {
		background-color: $page-color-base;
	}
	.rf-index {
		background-color: $color-white;
		/*爆款拼团*/
		.wrapper {
			border-radius: 10upx;
			.h-list {
				background-color: $page-color-base;
				white-space: nowrap;
				padding: 0 $spacing-sm;
				.h-item {
					margin: $spacing-sm $spacing-sm $spacing-sm 0;
					display: inline-block;
					background-color: $color-white;
					font-size: $font-sm;
					width: 280upx;
					border-radius: 6upx;
					.h-item-img {
						display: inline-block;
						width: 280upx;
						height: 300upx;
						border-top-left-radius: 12upx;
						border-top-right-radius: 12upx;
						border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
					}
					.title {
						width: 280upx;
						white-space : normal;
						height: 60upx;
						line-height: 30upx;
						font-size: $font-sm;
						padding: 0 $spacing-sm;
						margin: $spacing-sm 0;
					}
					.last-line {
						padding: 0 $spacing-sm $spacing-base;
						margin-bottom: 5upx;
						display: flex;
						justify-content: space-between;
						align-items: center; /* 垂直居中 */
						.red {
							font-size: $font-sm;
							margin-right: 4upx;
						}
					}
					.price {
						font-size: $font-base - 2upx;
						line-height: 1;
						.m-price {
							margin-left: 8upx;
							color: $font-color-light;
							font-size: $font-sm;
							text-decoration: line-through;
						}
					}
				}
			}
		}
		/*轮播图*/
		.swiper {
			width: 100%;
			margin-bottom: 20upx;
			display: flex;
			justify-content: center;
			.swiper-box {
				width: 92%;
				height: 40vw;
				overflow: hidden;
				border-radius: 15upx;
				box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
				//兼容ios，微信小程序
				position: relative;
				z-index: 1;
				swiper {
					width: 100%;
					height: 40vw;
					swiper-item {
						image {
							width: 100%;
							height: 40vw;
						}
					}
				}
			}
		}
		/* 爆款推荐 */
		.hot-recommend {
			background-color: $color-white;
			display: flex;
			padding: $spacing-base $spacing-lg 0;
			.hot-recommend-image {
				width: 100%;
				height: 100%;
			}
			.left {
				flex: 3;
				height: 350upx;
				margin-right: 15upx;
			}
			.right {
				flex: 4;
				.hot-recommend-image {
					height: 170upx;
				}
			}
		}
		/*轮播图2*/
		.swiper-item-text {
			position: absolute;
			bottom: 16upx;
			left: 30upx;
			height: 48upx;
			line-height: 48upx;
			background: rgba(0, 0, 0, 0.2);
			width: 90%;
			color: $color-white;
			border-bottom-left-radius: 12upx;
			padding-left: 20upx;
		}
		/*新闻通知*/
		.swiper-slide-header {
			.iconfont {
				font-size: $font-lg + 8upx;
				font-weight: 600;
			}
		}
		/*分类列表*/
		.category-list-wrapper {
			.category-list {
				width: 100%;
				padding: $spacing-base;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.category {
					margin-top: 10upx;
					width: calc(20% - 20upx);
					height: 132upx;
					display: flex;
					text-align: center;
					flex-wrap: wrap;
					.img {
						width: 100%;
						display: flex;
						justify-content: center;
						image {
							width: 12vw;
							height: 12vw;
							border-radius: 50%;
						}
					}
					.text {
						margin-top: 16upx;
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24upx;
						color: #3c3c3c;
					}
				}
			}
		}
		/*版权显示*/
		.copyright {
			margin: 10upx 0;
			width: 100%;
			text-align: center;
			color: #666;

			a {
				display: block;
				color: #666;
				text-decoration: none;
			}
		}
		/*限时抢购*/
		.order-item {
			display: flex;
			flex-direction: column;
			background: #fff;
			padding: 0 30upx;
			margin-bottom: 20upx;

			.goods-box-single {
				display: flex;
				padding: 40upx 10upx 10upx;
				height: 330upx;
				border-radius: 12upx;
				margin-top: 20upx;
				box-shadow: 2px 2px 10px rgba(66, 135, 193, 0.2); // 阴影
				border-bottom: 1px solid rgba(0, 0, 0, 0.05); // 边框
				position: relative;

				.goods-img {
					display: block;
					border-radius: 12upx;
					width: 190upx;
					height: 200upx;
				}

				.right {
					flex: 1;
					display: flex;
					flex-direction: column;
					padding: 0 30upx 0 24upx;
					overflow: hidden;

					.title {
						font-weight: bold;
						line-height: 1.2;
						margin: 10upx 0;
					}

					.attr-box {
						line-height: 1.2;
						margin-bottom: 8upx;
						margin-left: 10upx;
					}

					.last-line {
						margin-top: 3upx;
						display: flex;
						justify-content: space-between;
						align-items: center; /* 垂直居中 */
						.red {
							margin-right: 4upx;
						}
					}

					.price {
						font-size: $font-lg;
						line-height: 1;
						.m-price {
							margin-left: 8upx;
							color: $font-color-light;
							font-size: $font-sm;
							text-decoration: line-through;
						}
					}

					.triangle-wrapper {
						position: absolute;
						overflow: hidden;
						top: 0;
						right: 0;
						border-radius: 12upx;

						.triangle {
							color: #5eba8f;
							width: 0;
							height: 0;
							border-top: 120upx solid;
							opacity: 0.8;
							border-left: 120upx solid transparent;
						}

						.triangle-content {
							position: absolute;
							top: 28upx;
							right: 0;
							transform: rotate(45deg);
							font-size: $font-sm - 2upx;
							color: #fff;
						}
					}
				}
			}

			.action-box {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 90upx;
				position: relative;

				.discount-time {
					font-size: $font-sm;
					color: $uni-color-success;
					margin-right: 20upx;
				}
			}
		}
		.index-cate-product-list {
			padding-top: $spacing-sm;
			background-color: $page-color-base;
			.no-data {
				margin: 48upx 0;
				color: $font-color-light;
				display: flex;
				justify-content: center;
				align-items: center;
				.iconfont {
					margin-right: 20upx;
					font-size: $font-lg + 16upx;
				}
			}
		}
	}
</style>
