  import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NewsAdminOverviewComponent} from "./news/overview/news-admin-overview.component";
import {UserTableComponent} from "./user/table/user-table.component";
import {SystemconfigTableComponent} from "./systemconfig/table/systemconfig-table.component";
import {ProtocolTableComponent} from "./protocol/table/protocol-table.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'tch-admin',
  templateUrl: './admin.component.html',
  imports: [NgIf, NewsAdminOverviewComponent, UserTableComponent, SystemconfigTableComponent, ProtocolTableComponent]
})
export class AdminComponent implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  tab = 'news';

  ngOnInit(): void {
    this.tab = this.route.snapshot.queryParams.tab ?? 'news';
  }

  select(tab: string) {
    this.tab = tab;
  }
}
