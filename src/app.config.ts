export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/rank/index',
    'pages/advice/index',
    'pages/todo/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '商家舆情助手',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '今日提及'
      },
      {
        pagePath: 'pages/rank/index',
        text: '同城榜单'
      },
      {
        pagePath: 'pages/advice/index',
        text: '行动建议'
      }
    ]
  }
})
