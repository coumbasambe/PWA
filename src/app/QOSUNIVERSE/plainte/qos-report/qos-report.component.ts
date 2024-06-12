import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BaseService } from 'src/app/shared/base.service';

@Component({
  selector: 'app-qos-report',
  templateUrl: './qos-report.component.html',
  styles:[ `
    
  `],
  encapsulation: ViewEncapsulation.None,
})

export class QosReportComponent implements OnInit {
  @Input() groupeName: string;

    userDashboards = [];
    selectedDashboard;
    current_url: SafeUrl;
    constructor(private sanitizer: DomSanitizer,private baseService: BaseService) {
    }
    public ngOnInit() {
      this.getDashboards();
    }
    getDashboards() {
      console.log(this.groupeName)
      this.baseService.get('Dashboards?filter={"where": {"nom": "'+ this.groupeName+'" }}', false).subscribe(dashboards => {
        this.buildDashboard(dashboards[0])
      });
    }

    buildDashboard(dash){
      if (!this.selectedDashboard || (this.selectedDashboard && dash.id!=this.selectedDashboard.id)) {
          this.selectedDashboard = dash;
          this.current_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDashboard.iframe)
      }
  }

  
}
