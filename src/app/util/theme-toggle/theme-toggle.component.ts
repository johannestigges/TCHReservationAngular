import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'tch-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {
  theme = 'light';

  ngOnInit(): void {
    this.setTheme()
  }

  toggleTheme() {
    const theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    this.setTheme();
  }

  setTheme() {
    this.theme = localStorage.getItem('theme') ?? 'light';
    document.documentElement.classList.toggle('dark', this.theme === 'dark');
  }

}
