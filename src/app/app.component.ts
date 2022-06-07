import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApplicationPropertiesService } from './applicationproperties/application-properties.service';

@Component({
  selector: 'tch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private title: Title,
    private service: ApplicationPropertiesService
  ) {}

  ngOnInit(): void {
    this.service
      .getApplicationProperties()
      .subscribe((props) => this.title.setTitle(props.title));
  }
}
