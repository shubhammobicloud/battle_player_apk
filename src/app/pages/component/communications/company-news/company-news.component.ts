import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { NewsSerives } from 'src/app/services/news/news.service';
@Component({
  selector: 'app-company-news',
  templateUrl: './company-news.component.html',
  styleUrls: ['./company-news.component.scss'],
  animations: [
    trigger('likeAnimation', [
      state(
        'liked',
        style({
          transform: 'scale(1.2)', // You can customize the scale value for the desired animation effect
        })
      ),
      transition('void => liked', animate('200ms ease-in')),
    ]),
  ],
})
export class CompanyNewsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private newsService:NewsSerives
  ) {}
  userId = localStorage.getItem('userId');
  reacted: boolean = false;
  ngOnInit(): void {
    this.getCompanyNews();
  }
  listOfNews: any;
  getCompanyNews() {
   this.newsService.getNews()
      .subscribe((res: any) => {
        this.listOfNews = res.data;
        this.listOfNews.forEach((news: any) => {
          news.reacted = false; // Initialize reacted property for each news

          if (news.reactions.length > 0) {
            news.reactions.forEach((react: any) => {
              if (react.user === this.userId) {
                news.reacted = true; // Set reacted to true if the user has reacted
              }
            });
          }
        });
      });
  }
  getFormattedDate(timestamp: string): string {
    const date = new Date(timestamp);
    const options: any = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return date.toLocaleDateString('en-US', options); // Adjust locale and options as needed
  }
  likeNews(news: any) {
    let id =localStorage.getItem('userId');
    let data = {
      emoji: 'like',
      user: id,
    };

    // this.http
    //   .put(environment.baseUrl + 'react-on-news/' + news._id, data)
    //   .subscribe(
    //     (res: any) => {
    //       if (res.message == ' Reactions removed successfully') {
    //         this.toastr.warning('Disliked');
    //       } else if (res.message == 'Reactions added successfully') {
    //         this.toastr.success('Liked');
    //       }
    //       this.getCompanyNews();
    //     },
    //     (error) => {
    //       // Handle error
    //       console.error('An error occurred:', error);
    //     }
    //   );
  }
}
