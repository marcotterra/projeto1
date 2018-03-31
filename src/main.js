"use strict";
import Repository from "./Repository.js";

class Project {
  constructor() {
    this.orders = new Repository();

    this.inputid = document.getElementById("inputid");
    this.inputp = document.getElementById("inputp");
    this.inputm = document.getElementById("inputm");
    this.inputg = document.getElementById("inputg");
    this.form = document.getElementById("form1");
    
    this.init();
  }

  init() {
    this.form.onsubmit = event => this.save(event);
  }

  registerButtons() {
    let buttons = document.querySelectorAll("#orders-table tr td a");

    buttons.forEach(item => {
      if (item.dataset.editOrderId) {
        item.onclick = event => this.edit(event, item.dataset.editOrderId);
      }

      if (item.dataset.deleteOrderId) {
        item.onclick = event => this.delete(event, item.dataset.deleteOrderId);
      }
    });
  }

  edit(event, orderID) {
    if (event) event.preventDefault();
    let order = this.orders.findById(parseInt(orderID));
    this.manageForm(order);
  }

  delete(event, orderID) {
    if (event) event.preventDefault();

    let { id } = this.orders.findById(parseInt(orderID));
    let answer = window.confirm("Deseja deletar o pedido: " + id);

    if (answer) {
      this.orders.del(id);
      window.alert("Deletado com sucesso!");
    } else {
      window.alert("Cancelado com sucesso!");
    }

    this.mountTable();
  }

  manageForm(values) {
    if (!values && values == undefined) {
      let order = [];

      order.id = this.inputid.value;
      order.p = this.inputp.value;
      order.m = this.inputm.value;
      order.g = this.inputg.value;
      order.total =
        parseInt(this.inputp.value) +
        parseInt(this.inputm.value) +
        parseInt(this.inputg.value);
      return order;

    } else {
      this.inputid.value = values.id;
      this.inputp.value = values.p;
      this.inputm.value = values.m;
      this.inputg.value = values.g;
      this.alert({
        msg: `Pedido id: <strong>${values.id}</strong>`,
        op: true
      });
    }
  }

  validate(order) {
    let errors = [];

    if (!order.p || order.p.length === 0) {
      errors = { msg: "Campo P inválido" };
    } else if (!order.m || order.m.length === 0) {
      errors = { msg: "Campo M inválido" };
    } else if (!order.g || order.g.length === 0) {
      errors = { msg: "Campo G inválido" };
    }
    return errors;
  }

  save(event) {
    //impede a ação padrao do formulário, (utilizado para não atualizar a página)
    if (event) event.preventDefault();

    //salva em $order os valores obtidos do form
    let order = this.manageForm();

    //valida as informações obtidas do form
    let errors = this.validate(order);

    if (errors.length == 0) {
      //limpa o erro
      this.alert(errors);

      //salva ou atualiza as informações
      this.orders.save(order);

      //insere as informações na tabela
      this.mountTable();

      //limpa o form
      this.clearForm();

      // após adcionar novos elementos no DOM, fas o registro dos eventos dos novos elementos
      this.registerButtons();
    } else {
      //mostra o erro
      this.alert(errors);
    }
  }

  alert(a) {
    let divErr = document.getElementById("errors");

    if (a === undefined || a.length === 0) {
      divErr.innerHTML = "";
    } else if (a.op) {
      divErr.innerHTML = `<button class="button button-outline">
                            ${a.msg}
                          </button>
                          
                          <button id="btn-cEdit" class="button button-outline button-black">
                            cancelar
                          </button>`;

      let btnCancel = document.getElementById("btn-cEdit");
      btnCancel.onclick = event => this.cancelEdit();
    } else {
      divErr.innerHTML = `<button class="button button-outline"> 
                            ${a.msg}
                          </button>`;
    }
  }

  cancelEdit() {
    this.clearForm();
    this.alert();
  }

  clearForm() {
    this.inputid.value = "";
    this.inputp.value = "";
    this.inputm.value = "";
    this.inputg.value = "";
  }

  mountTable() {
    let divTable = document.getElementById("orders-table");
    divTable.innerHTML = "";
    this.orders.findAll().forEach(element => {
      divTable.innerHTML += this.tableRow(element);
    });
  }

  tableRow(obj) {
    return `<tr>
              <td>${obj.id}</td>
              <td>${obj.p}</td>
              <td>${obj.m}</td>
              <td>${obj.g}</td>
              <td>${obj.total}</td>
              <td>
                  <ul class="table-buttom">
                      <li>
                          <a href="#" class="button button-small button-outline edit" 
                            data-edit-order-id="${obj.id}">edit</a>
                      </li>
                      <li>
                          <a href="#" class="button button-small button-outline delete"
                            data-delete-order-id="${obj.id}">del</a>
                      </li>
                  </ul>
              </td>
          </tr>`;
  }
}

new Project();
