import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { NewsSerives } from 'src/app/services/news/news.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-company-news',
  templateUrl: './company-news.component.html',
  styleUrls: ['./company-news.component.scss']
})
export class CompanyNewsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private newsService: NewsSerives,
    private userService: UserService,
    private sanitize:DomSanitizer
  ) {}

  userId: any;
  userDetails: any;
  likedNewsIds: string[] = [];

  ngOnInit(): void {
    this.getCompanyNews();
  }

  listOfNews: any;
  postLikeByUser: boolean = false;

  getCompanyNews() {
    this.newsService.getNews().subscribe(
      (res: any) => {
        this.listOfNews = res.data;
        this.updateLikedNewsIds();
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  updateLikedNewsIds() {
    // Assuming you have fetched liked news item IDs and stored them in likedNewsIds
    this.userService.getProfileDetails().subscribe(
      (res: any) => {
        this.likedNewsIds = Object.keys(res.data.favoriteNewsFeed);
        this.updateNewsReactions();
      },
      (error:any) => {
        console.error('An error occurred:', error);
      }
    );
  }

  updateNewsReactions() {
    // Iterate through listOfNews and update the 'reacted' property based on whether it's liked or not
    this.listOfNews.forEach((news: any) => {
      news.reacted = this.likedNewsIds.includes(news._id);
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

  likeNews(news_id: any) {
    this.newsService.reactOnNews(news_id).subscribe(
      (res: any) => {
        if (res.message=='Reactions removed successfully') {
          this.toastr.warning('Disliked');
        } else if (res.message=='Reactions added successfully') {
          this.toastr.success('Liked');
        }
        this.getCompanyNews();
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  sanitizerHTML(content:string){
    return this.sanitize.bypassSecurityTrustHtml(content)
  }
}
