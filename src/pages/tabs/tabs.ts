import { Component } from '@angular/core';

import { DocumentPage } from '../document/document';
import { EvenementPage } from '../evenement/evenement';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = EvenementPage;
  tab3Root = DocumentPage;
  tab4Root = ProfilePage;

  constructor() {

  }
}
