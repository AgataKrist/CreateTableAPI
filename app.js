
const $selectChange = document.querySelector('.selectChange')
const $propagation = document.querySelector('.propagation')
const $selection = document.querySelector('.selection')
const $select = document.createElement('select')
let settings = null
function localStor() {
   if (localStorage.getItem('settings')) {
      settings = JSON.parse(localStorage.getItem('settings'))
   } else {
      settings = {
         page: 1,
         per_page: 1,
      }
   }
   return settings
}
localStor()

function server(url, method = 'GET') {
   return new Promise((res, rej) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.send();
      xhr.responseType = 'json';
      xhr.onload = () => res(xhr.response)
      xhr.onerror = (error) => rej('error')
   })
}

function init() {
   server(`https://reqres.in/api/users?page=${settings.page}&per_page=${settings.per_page}`)
      .then(res => {
         createTable(res.data)
         propagation(res.total_pages, res.page)
         selection(res.per_page, res.total)
      })
      .catch(error => error)
      .finally(() => { console.log('data success') })
}
init()

// "page": 2,//Номер текущей страницы
// "per_page": 6,//Количество отображаемых элементов
// "total": 12,//всего элементов
// "total_pages": 2,//сколько всего страниц(total/per_page)


function createTable(res) {
   const $table = document.querySelector('.table')
   $table.innerHTML = ''
   res.forEach(element => {
      $table.innerHTML += `
                           <tr>
                              <td>${element.first_name} ${element.last_name}</td>
                              <td><a href="mailto:${element.email}">${element.email}</a></td>
                              <td><img class = 'image'  src='${element.avatar}'></td>
                           </tr>
                        `
   });
}

function propagation(total_pages, page) {
   $propagation.innerHTML = ''
   for (let i = 0; i < total_pages; i++) {
      if (page === i + 1) {
         $propagation.innerHTML += `
         <span class="page__item active">${i + 1}</span>
         `
      } else {
         $propagation.innerHTML += `
                              <span class="page__item">${i + 1}</span>
                              `
      }
   }
}

function selection(per_page, total) {
   $selection.appendChild($select)
   $select.innerHTML = ''
   for (let i = 1; i <= total; i++) {
      if (i === per_page) {
         $select.innerHTML += `
                                 <option selected value="${i}">${i}</option>
                              `
      } else {
         $select.innerHTML += `
                           <option value="${i}">${i}</option>
                        `
      }
   }
}

$select.addEventListener('change', function (e) {
   settings.per_page = e.target.value
   settings.page = 12 / e.target.value
   init()
   localStorage.setItem('settings', JSON.stringify(settings))
})

$propagation.addEventListener('click', function (e) {

   const target = e.target
   settings.page = target.innerText
   init()
   localStorage.setItem('settings', JSON.stringify(settings))
})






