import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import 'vant/lib/index.css';
import './assets/styles/global.less';

// 在开发环境下引入Mock
// 暂时禁用mock数据，使用真实接口
// if (process.env.NODE_ENV === 'development') {
//   console.log('Loading mock data...');
//   Promise.all([
//     import('./mock/equipment.js'),
//     import('./mock/maintenance.js'),
//     // Add other mock files here
//   ]).then(() => {
//     console.log('Mock data loaded successfully');
//   });
// }

// 按需导入Vant组件
import {
  Button,
  NavBar,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  CellGroup,
  Toast,
  Dialog,
  Notify,
  Icon,
  Cell,
  List,
  PullRefresh,
  Swipe,
  SwipeItem,
  Tag,
  Popup,
  Picker,
  DatePicker,
  TimePicker,
  Switch,
  Uploader,
  ActionSheet,
  Empty,
  Loading,
  Skeleton,
  Image as VanImage,
  Search,
  Card,
  Badge,
  Divider,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Stepper,
  Calendar,
  Tab,
  Tabs,
  showFailToast,
  Grid,
  GridItem,
  FloatingBubble
} from 'vant';

// 创建Vue应用实例
const app = createApp(App);

// 注册Vant组件
app.use(Button);
app.use(NavBar);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Toast);
app.use(Dialog);
app.use(Notify);
app.use(Icon);
app.use(Cell);
app.use(List);
app.use(PullRefresh);
app.use(Swipe);
app.use(SwipeItem);
app.use(Tag);
app.use(Popup);
app.use(Picker);
app.use(DatePicker);
app.use(TimePicker);
app.use(Switch);
app.use(Uploader);
app.use(ActionSheet);
app.use(Empty);
app.use(Loading);
app.use(Skeleton);
app.use(VanImage);
app.use(Search);
app.use(Card);
app.use(Badge);
app.use(Divider);
app.use(Steps);
app.use(Step);
app.use(Checkbox);
app.use(CheckboxGroup);
app.use(RadioGroup);
app.use(Radio);
app.use(Stepper);
app.use(Calendar);
app.use(Tab);
app.use(Tabs);
app.use(Grid);
app.use(GridItem);
app.use(FloatingBubble);

// 创建Pinia实例
const pinia = createPinia();

// 使用插件
app.use(router);
app.use(pinia);

// 挂载应用
app.mount('#app');