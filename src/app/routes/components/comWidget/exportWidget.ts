//import {PublicSFComponent as sf} from "../publicSF";
import {TreeComponent as tree} from "../tree/tree.component";
import {ActiveWidgetComponent as activeWidget} from "./active-widget";
import {PublishListComponent as list} from "../list/publish-list.component";
import {VersionListComponent as menu} from "../list/version-list.component";
import {CustomTableComponent as table} from "../custom-table";
import {TerminalProcessComponent as treeSelect} from "../../template/tab-template/terminal-process";
import {PublicSTComponent as st} from "../publicST";
import {EditFormComponent as sf} from "../edit-form/edit-form.component";
import {MenuTreeComponent as menuTree} from "../menu-tree.component";

let coms = {
  activeWidget, //动态组件
  sf,
  tree,
  list,
  table,
  treeSelect,
  st,
  menu,
  menuTree
}

const importComs = [
  sf,
  tree,
  list,
  table,
  treeSelect,
  st,
  menu,
  menuTree
]
const modalComs = [
  sf,
  st
]
 const activeComs = {
   sf,
   tree,
   list,
   table,
   treeSelect,
   st,
   menu,
   menuTree
 }
export { coms, importComs, activeComs, modalComs}