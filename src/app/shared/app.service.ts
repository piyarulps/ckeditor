import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Product } from '../models/products';
import { HttpClient } from '@angular/common/http';
    
@Injectable()
export class AppService {
   productList:any;

   constructor(private http: HttpClient){}
    
    public getProductsData(): Observable<any> {
        return this.http.get("https://dummyjson.com/products?limit=50");
    }
    public getProductsDetails(id:string): Observable<any> {
        return this.http.get(`https://dummyjson.com/products/${id}`);
    }
    public updateProduct(id:string,data:any): Observable<any> {
        return this.http.put(`https://dummyjson.com/products/${id}`,data);
    }  
    public getCategory(): Observable<any> {
        return this.http.get("https://dummyjson.com/products/categories");
    }  
    public DeleteProductsData(id:number): Observable<any> {
        return this.http.delete(`https://dummyjson.com/products/${id}`);
    }
    
};