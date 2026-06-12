import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Produto {
  id: number,
  nome: string,
  descricao: string,
  preco: number,
  quantidade: number,
  total: number
}

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

  mensagem = signal<string>('');

  produtoSelecionado = signal<Produto>({
    id: 0,
    nome: '',
    descricao: '',
    preco: 0.0,
    quantidade: 0,
    total: 0.0
  });

  exibirFormulario = signal<boolean>(false);

  url: string = 'http://localhost:8081/api/v1/produtos';

  pesquisarProdutos() {
    this.httpClient.get<any[]>(`${this.url}/listar?nome=${this.nomeProduto}`)
      .subscribe(data => {
        this.listaProdutos.set(data);
      });
  }

  novoProduto() {
    this.exibirFormulario.set(true);

  }

  cadastrarProduto() {

    this.httpClient.post(`${this.url}/criar`, this.produtoSelecionado(), { responseType: 'text' })
      .subscribe(
        {
          next: (response) => {
            this.mensagem.set(response);
            this.cancelarEdicao();

            if (this.verificarConsulta()) {
              this.pesquisarProdutos();
            }
          },
          error: (err) => {
            this.mensagem.set(err);
          }
        }
      );

  }

  verificarConsulta() {
    return this.listaProdutos().length > 0;
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.httpClient.delete(`${this.url}/excluir/${id}`, { responseType: 'text' })
        .subscribe(
          {
            next: (response) => {
              this.mensagem.set(response);
              this.pesquisarProdutos();
            },
            error: (err) => {
              this.mensagem.set(err);
            }
          }
        );
    }
  }

  editarProduto(id: number) {

  }

  cancelarEdicao() {
    this.exibirFormulario.set(false);
    this.produtoSelecionado.set({
      id: 0,
      nome: '',
      descricao: '',
      preco: 0.0,
      quantidade: 0,
      total: 0.0
    });
  }

  fecharNotificacao() {
    this.mensagem.set('');
  }
}
