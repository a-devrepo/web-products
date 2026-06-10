import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  httpClient = inject(HttpClient)

  nomeProduto: string = '';

  listaProdutos = signal<any[]>([]);

  url: string = 'http://localhost:8081/api/v1/produtos/listar?nome=';

  pesquisarProdutos(){
    this.httpClient.get<any[]>(`${this.url}${this.nomeProduto}`)
    .subscribe(data => {
      this.listaProdutos.set(data);
    });
  }

  excluirProduto(id:any){

  }

  editarProduto(id:any){

  }
}
