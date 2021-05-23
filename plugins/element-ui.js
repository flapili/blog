import Vue from 'vue'
// import Element from 'element-ui'
import locale from 'element-ui/lib/locale'
import lang from 'element-ui/lib/locale/lang/fr'

locale.use(lang)
// Vue.use(Element, { locale })


import 'element-ui/lib/theme-chalk/icon.css';
// import 'element-ui/lib/theme-chalk/display.css';

import ElCard from 'element-ui/lib/card';
import 'element-ui/lib/theme-chalk/card.css';
Vue.component(ElCard.name, ElCard);


import ElCol from 'element-ui/lib/col';
import 'element-ui/lib/theme-chalk/col.css';
Vue.component(ElCol.name, ElCol);


import ElRow from 'element-ui/lib/row';
import 'element-ui/lib/theme-chalk/row.css';
Vue.component(ElRow.name, ElRow);


import ElContainer from 'element-ui/lib/container';
import 'element-ui/lib/theme-chalk/container.css';
Vue.component(ElContainer.name, ElContainer);


import ElHeader from 'element-ui/lib/header';
import 'element-ui/lib/theme-chalk/header.css';
Vue.component(ElHeader.name, ElHeader);


import ElMain from 'element-ui/lib/main';
import 'element-ui/lib/theme-chalk/main.css';
Vue.component(ElMain.name, ElMain);


import ElFooter from 'element-ui/lib/footer';
import 'element-ui/lib/theme-chalk/footer.css';
Vue.component(ElFooter.name, ElFooter);


import ELMenu from 'element-ui/lib/menu';
import 'element-ui/lib/theme-chalk/menu.css';
Vue.component(ELMenu.name, ELMenu);


import ELMenuItem from 'element-ui/lib/menu-item';
import 'element-ui/lib/theme-chalk/menu-item.css';
Vue.component(ELMenuItem.name, ELMenuItem);


// import ElImage from 'element-ui/lib/image';
// import 'element-ui/lib/theme-chalk/image.css';
// Vue.component(ElImage.name, ElImage);


// import ElAvatar from 'element-ui/lib/avatar';
// import 'element-ui/lib/theme-chalk/avatar.css';
// Vue.component(ElAvatar.name, ElAvatar);


// import ElTag from 'element-ui/lib/tag';
// import 'element-ui/lib/theme-chalk/tag.css';
// Vue.component(ElTag.name, ElTag);


// import ElAutocomplete from 'element-ui/lib/autocomplete';
// import 'element-ui/lib/theme-chalk/autocomplete.css';
// Vue.component(ElAutocomplete.name, ElAutocomplete);


import ElButton from 'element-ui/lib/button';
import 'element-ui/lib/theme-chalk/button.css';
Vue.component(ElButton.name, ElButton);


// import ElScrollbar from 'element-ui/lib/scrollbar';
// import 'element-ui/lib/theme-chalk/scrollbar.css';
// Vue.component(ElScrollbar.name, ElScrollbar);


import ElDialog from 'element-ui/lib/dialog';
import 'element-ui/lib/theme-chalk/dialog.css';
Vue.component(ElDialog.name, ElDialog);


import ElInput from 'element-ui/lib/input';
import 'element-ui/lib/theme-chalk/input.css';
Vue.component(ElInput.name, ElInput);


// import ElSelect from 'element-ui/lib/select';
// import 'element-ui/lib/theme-chalk/select.css';
// Vue.component(ElSelect.name, ElSelect);


// import ElOption from 'element-ui/lib/option';
// import 'element-ui/lib/theme-chalk/option.css';
// Vue.component(ElOption.name, ElOption);