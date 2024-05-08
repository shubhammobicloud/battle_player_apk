import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { NewsSerives } from 'src/app/services/news/news.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NewsUpdateService } from 'src/app/services/news/newsUpdate.service';
import { environment } from 'src/environment/enviroment';
import { jwtDecode } from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-news',
  templateUrl: './company-news.component.html',
  styleUrls: ['./company-news.component.scss']
})
export class CompanyNewsComponent implements OnInit {
  @Output() updateParentState: EventEmitter<any> = new EventEmitter<any>();

  showTeamChats: boolean = true;
  hidesuper: boolean = false;

  showTeamChat: boolean = false;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private newsService: NewsSerives,
    private route: Router,
    private userService: UserService,
    private updateService: NewsUpdateService,
    private sanitize:DomSanitizer,
    public translate:TranslateService
  ) {}

  userId: any;
  userDetails: any;
  likedNewsIds: string[] = [];

  ngOnInit(): void {
    this.getCompanyNews();
    const token: any = localStorage.getItem('token');

    let data: {
      _id: any;
      teamId: any;
      avatar: any;
      userName: any;
      superUser: boolean;
    } = jwtDecode(token);

    console.log('check', data.superUser);
    this.hidesuper = data.superUser;
    // this.hidesuper=true

    if (data.superUser) {
      this.showTeamChat = !this.showTeamChat;


    }
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
        if (res.message === 'Reactions removed successfully') {
          this.toastr.warning(this.translate.instant('COMMUNICATION_PAGE.REACTIONS_REMOVED_SUCCESS'));
        } else if (res.message === 'Reactions added successfully') {
          this.toastr.success(this.translate.instant('COMMUNICATION_PAGE.REACTIONS_ADDED_SUCCESS'));
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
  updateNews(news: any) {
    console.log(news);
    this.updateService.news = news;
    // this.updateService.showTeamChat = false
    this.updateParentVariable(true)

    if (news) {
      // this.showTeamChat = !this.showTeamChat;
      // @Output()

    }
  }
  updateParentVariable(value: any) {
    this.updateParentState.emit(value);
  }
  getListofNews() {
    this.http.get(environment.baseUrl + 'news').subscribe((res: any) => {
      this.listOfNews = res.data;
    });
  }


  // deleteNews(id: any) {
  //   this.http.delete(environment.baseUrl + 'news/' + id).subscribe(
  //     (res: any) => {
  //       // console.log(res)
  //       if (res.success) {
  //         // location.reload()
  //         this.toastr.success('News deleted successfully');
  //         this.getListofNews();
  //       }
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.log('error', error);
  //       this.toastr.error(error.error.message);
  //     }
  //   );
  // }
}
