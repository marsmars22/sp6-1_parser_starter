// @todo: напишите здесь код парсера
// Получение мета-информации страницы
// Что необходимо получить:
// Язык страницы с тега html.
// Заголовок страницы без названия сайта: названия добавляют для унификации заголовков между разными сайтами, это одно из правил поисковой оптимизации. Вам нужно разделить строку по символу «—».
// Ключевые слова из мета-тега, собрать в виде массива слов, разделить по «,».
// Описание из мета-тега.
// Оpengraph-описание (мета-теги с ключами вида og:*) в виде объекта с полями, имена которых соответствуют ключам в тегах за вычетом префикса og:.

function metaParse() {
  const language = document.documentElement.lang.trim();
  const description = document
    .querySelector('meta[name ="description"]')
    .getAttribute("content")
    .trim();
  const keywordsText = document
    .querySelector('meta[name = "keywords"]')
    .getAttribute("content");

  const keywordsArr = Array.from(keywordsText.split(", "));
  const keywords = keywordsArr.map((k) => {
    k = k.trim();
    return k;
  });
  const title = document.title.split("—")[0].trim();
  const titleOG = document
    .querySelector('meta[property = "og:title"]')
    .getAttribute("content")
    .split("—")[0]
    .trim();
  const imageOg = document
    .querySelector('meta[property = "og:image"]')
    .getAttribute("content")
    .trim();
  const typeOG = document
    .querySelector('meta[property = "og:type"]')
    .getAttribute("content")
    .trim();
  return {
    title,
    description,
    keywords,
    language,
    opengraph: { title: titleOG, image: imageOg, type: typeOG },
  };
}

function productsParse() {
  const id = document.querySelector(".product").dataset.id.trim();
  const name = document.querySelector(".title").textContent.trim();
  const isLiked = document.querySelector(".like").classList.contains("active");

  const images = [];
  const imagesAll = document.querySelectorAll("nav button img");
  Array.from(imagesAll).forEach((i) => {
    const preview = i.getAttribute("src");
    const full = i.dataset.src;
    const alt = i.getAttribute("alt");
    images.push({ preview, full, alt });
  });

  const tags = {
    category: [],
    discount: [],
    label: [],
  };
  const tagsAll = document.querySelector(".tags");
  Array.from(tagsAll.children).forEach((t) => {
    const tagText = t.textContent.trim();
    if (t.classList.contains("green")) {
      tags.category.push(tagText);
    }
    if (t.classList.contains("blue")) {
      tags.label.push(tagText);
    }
    if (t.classList.contains("red")) {
      tags.discount.push(tagText);
    }
  });

  const price = document.querySelector(".price");
  const newPrice = price.firstChild.textContent.trim();
  const oldPriceText = price.lastElementChild.textContent.trim();
  const oldPrice = parseInt(oldPriceText.replace(/\D/g, ""));
  const currentPrice = parseInt(newPrice.replace(/\D/g, ""));

  const discount = oldPrice - currentPrice;
  const discountPercentNum = (discount / oldPrice) * 100;
  const discountPercent = `${discountPercentNum.toFixed(2)}%`;
  if (discount === "0") {
    discountPercent = "0%";
  }

  const currency =
    oldPriceText[0] === "₽" ? "RUB" : oldPriceText[0] === "$" ? "USD" : "EUR";
  const properties = {};
  const propertiesPatse = document.querySelectorAll(".properties li");
  Array.from(propertiesPatse).forEach((p) => {
    const key = p.firstElementChild.textContent;
    const value = p.lastElementChild.textContent;
    properties[key] = value;
  });
  const descriptionParse = document.querySelector(".description");
  const clone = descriptionParse.cloneNode(true);

  clone.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      el.removeAttribute(attr.name);
    });
  });

  const description = clone.innerHTML.trim();

  return {
    id,
    name,
    isLiked,
    tags,
    price: currentPrice,
    oldPrice,
    discount,
    discountPercent,
    currency,
    properties,
    description,
    images,
  };
}
function suggestedParse() {
  const suggested = [];
  const containersSuggested = document.querySelectorAll(
    ".suggested .container .items article",
  );
  Array.from(containersSuggested).forEach((c) => {
    const info = {};
    info.name = c.querySelector("h3").textContent;
    info.description = c.querySelector("p").textContent;
    info.image = c.querySelector("img").getAttribute("src");
    const priceText = c.querySelector("b").textContent;
    info.price = priceText.replace(/\D/g, "");
    info.currency =
      priceText[0] === "₽" ? "RUB" : suggested[0] === "$" ? "USD" : "EUR";

    suggested.push(info);
  });

  return suggested;
}
function reviewsParse() {
  const reviews = [];
  const reviewContainer = document.querySelectorAll(
    ".reviews .container article",
  );
  Array.from(reviewContainer).forEach((r) => {
    const authorParse = r.querySelector(".author");
    const name = authorParse.querySelector("span").textContent.trim();
    const avatar = authorParse.querySelector("img").getAttribute("src");
    const ratingParse = r.querySelectorAll(".rating span");
    const title = r.querySelector(".title").textContent;
    const description = r.querySelector("p").textContent;
    const date = authorParse
      .querySelector("i")
      .textContent.trim()
      .replaceAll("/", ".");
    let rating = 0;

    Array.from(ratingParse).forEach((c) => {
      if (c.className === "filled") {
        rating++;
      }
    });

    const author = { name, avatar };
    reviews.push({ rating, author, title, description, date });
  });

  return reviews;
}
reviewsParse();
// "reviews": [
//     {
//       "rating": 2,
//       "author": {
//         "avatar": "https://placehold.co/48/424242/white.svg?text=1",
//         "name": "author"
//       },
//       "title": "title",
//       "description": "desc",
//       "date": "date"
//     },
function parsePage() {
  const meta = metaParse();
  const product = productsParse();
  const suggested = suggestedParse();
  const reviews = reviewsParse();
  return {
    meta,
    product,
    suggested,
    reviews,
  };
}

window.parsePage = parsePage;
