import { createOptimizedPicture } from '../../scripts/aem.js';

let product = {
  image: '',
  description: '',
  name: '',
  stock: '',
  price: '',
  currency: '',
};

//
// function getProductJson() {
//   const jsonStr = `{
//   "data": {
//     "products": {
//       "items": [
//         {
//           "name": "Galaxy A2-Bla-64 ",
//           "sku": "Galaxy A2-Bla-64",
//           "description": {
//             "html": "Galaxy A23 5G makes keeping up with the things you love most a breeze with virtually lag free 5G. Relive life's best moments with a wide-lens camera and infinite display."
//           },
//           "image": {
//             "url": "https://master-7rqtwti-f3ef32mfqsxfe.us-4.magentosite.cloud/media/catalog/product/cache/cd66438b6f093f936f90aed7cbc0bbf8/s/a/samsung-galaxy-a2-4gb-64gb-6.5-dual-sim.jpg",
//             "label": "Galaxy A2-Bla-64 ",
//             "position": null,
//             "disabled": null
//           },
//           "stock_status": "IN_STOCK",
//           "price_range": {
//             "minimum_price": {
//               "discount": {
//                 "percent_off": 0,
//                 "amount_off": 0
//               },
//               "final_price": {
//                 "value": 729.99,
//                 "currency": "USD"
//               },
//               "regular_price": {
//                 "value": 729.99
//               }
//             }
//           }
//         }
//       ]
//     }
//     }
//     }`;
//
//   return JSON.parse(jsonStr);
// }

function getProduct(sku) {
  const graphqlEndPoint = 'https://master-7rqtwti-f3ef32mfqsxfe.us-4.magentosite.cloud/graphql?query=';
  const queryParam = `
        {
          products(filter: {sku: {in: ["${sku}"]}}) {
            items {
              name
              sku
              description {
                html
              }
              image {
                url
                label
                position
                disabled
              }
              small_image {
                url
                label
                position
                disabled
              }
              thumbnail {
                url
                label
                position
                disabled
              }
              stock_status
              price_range {
                minimum_price {
                  discount {
                    percent_off
                    amount_off
                  }
                  final_price {
                    value
                    currency
                  }
                  regular_price {
                    value
                  }
                }
              }
            }
          }
        }`;

  const productQuery = graphqlEndPoint + queryParam;
  $.ajax({
    url: productQuery,
    type: 'GET',
    async: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    dataType: 'json',
    xhrFields: {
      withCredentials: false,
    },
    success(data) {
      console.log('---------data----->>>>>>');
      console.log(data);
      console.log('<<<<<<-----product---------');
      product = {
        image: data.data.products.items[0].image.url,
        description: data.data.products.items[0].description.html,
        name: data.data.products.items[0].name,
        stock: data.data.products.items[0].stock_status,
        price: data.data.products.items[0].price_range.minimum_price.final_price.value,
        currency: data.data.products.items[0].price_range.minimum_price.final_price.currency,
      };
      // THIS WORKS!!
      console.log(product);
      console.log('---------end---------');
    },
    error(data) {
      console.error('Error:', 'Session authentication Failed');
      console.log('******** data=', data);
    },
  });
}

// async function getProduct(sku) {
//   console.log('---------sku-----====' + sku);
//   const graphqlEndPoint = 'https://master-7rqtwti-f3ef32mfqsxfe.us-4.magentosite.cloud/graphql?query=';
//   const queryParam = `
//         {
//           products(filter: {sku: {in: ["${sku}"]}}) {
//             items {
//               name
//               sku
//               description {
//                 html
//               }
//               image {
//                 url
//                 label
//                 position
//                 disabled
//               }
//               small_image {
//                 url
//                 label
//                 position
//                 disabled
//               }
//               thumbnail {
//                 url
//                 label
//                 position
//                 disabled
//               }
//               stock_status
//               price_range {
//                 minimum_price {
//                   discount {
//                     percent_off
//                     amount_off
//                   }
//                   final_price {
//                     value
//                     currency
//                   }
//                   regular_price {
//                     value
//                   }
//                 }
//               }
//             }
//           }
//         }`;
//
//   const productQuery = graphqlEndPoint + queryParam;
//
//   const response = await fetch(productQuery, {
//     Method: 'GET',
//     Headers: {
//       Accept: 'application.json',
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();
//   console.log('---------data----->>>>>>');
//   console.log(data);
//   console.log('<<<<<<-----product---------');
//   product = {
//     image: data.data.products.items[0].image.url,
//     description: data.data.products.items[0].description.html,
//     name: data.data.products.items[0].name,
//     stock: data.data.products.items[0].stock_status,
//     price: data.data.products.items[0].price_range.minimum_price.final_price.value,
//     currency: data.data.products.items[0].price_range.minimum_price.final_price.currency,
//   };
//   // THIS WORKS!!
//   console.log(product);
//   console.log('---------end---------');
// }

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const sku = row.children[0].innerHTML;
    console.log(`Loading product ${sku}...`);
    // Get product information from graphQL:
    getProduct(sku);

    console.log('++++++NAME+++++++');
    console.log(product.name);

    const li = document.createElement('li');

    const productImageDiv = document.createElement('div');
    productImageDiv.classList.add('product-card-image');
    productImageDiv.innerHTML = `<picture>
            <source type="image/jpeg" srcset="${product.image}">
            <img loading="lazy" alt="A fast-moving Tunnel" src="${product.image}?width=750&amp;format=jpeg&amp;optimize=medium">
            </picture>`;
    li.appendChild(productImageDiv);

    const productBodyDiv = document.createElement('div');
    productBodyDiv.classList.add('product-card-body');
    productBodyDiv.innerHTML = `<p>${product.name}</p><p>${product.price} ${product.currency}</p><p>${product.stock}</p><p>${product.description}</p>`;
    li.appendChild(productBodyDiv);

    ul.append(li);
  });

  // ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
