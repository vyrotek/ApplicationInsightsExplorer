import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpUrlEncodingCodec } from '@angular/common/http';

interface QueryResponse {
  tables: Table[];
}

interface Table {
  name: string;
  columns: Column[];
  rows: string[][];
}

interface Column {
  name: string;
  type: string;
}


@Injectable()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  appKey: string = 'DEMO_APP';
  apiKey: string = 'DEMO_KEY';
  
  query: string = 'requests | limit 5';
  displayedColumns: string[];
  dataSource: string[][];
  results: QueryResponse;

  ngOnInit() {
  }

  async run() {

    // URL encode the user's query
    let encodedQuery = new HttpUrlEncodingCodec().encodeValue(this.query);
    
    // Request headers for API auth
    const requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders({
        'x-api-key': this.apiKey
      }), 
    };

    // Execute query
    this.results = await this.http.get<QueryResponse>(`https://api.applicationinsights.io/v1/apps/${this.appKey}/query?query=${encodedQuery}`, requestOptions).toPromise();
    
    // Bind results to grid
    this.displayedColumns = this.results.tables[0].columns.slice(0,5).map(a => a.name);
    this.dataSource = this.results.tables[0].rows;
  }

}


