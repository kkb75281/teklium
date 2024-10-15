import { skapi } from '@/main';
import { ref } from 'vue';

let crawl = async (obj) => {
  let res = await fetch(obj.url);
  let html = await res.text();

  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let imgTags = doc.querySelectorAll('img');
  let imageLinks = Array.from(imgTags).map((img) => img.src);
  let divTags = doc.querySelectorAll('div');
  let divContent = Array.from(divTags)
    .map((div) => div.textContent.trim())
    .filter((text) => text.length > 0);
  let preTags = doc.querySelectorAll('pre');
  let preContent = Array.from(preTags)
    .map((pre) => pre.textContent.trim())
    .filter((text) => text.length > 0);

  if (imageLinks.length) {
    obj.img = imageLinks[0];
  }
  if (divContent.length) {
    obj.cont = divContent[0];
  } else {
    obj.cont = preContent[0];
  }

  const isValidUrl = (urlString) => {
    let urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // validate fragment locator

    return urlPattern.test(urlString);
  };

  let extractedText = null;

  const firstDollarIndex = obj.cont.indexOf('$');
  if (firstDollarIndex !== -1) {
    extractedText = obj.cont.substring(firstDollarIndex + 1).trim();

    const secondDollarIndex = extractedText.indexOf('$');
    if (secondDollarIndex !== -1) {
      extractedText = extractedText.substring(0, secondDollarIndex).trim();
    }
  }

  let anchorTag = null;

  if (extractedText && isValidUrl(extractedText)) {
    anchorTag = `<a href="${extractedText}" target="_blank">${extractedText}</a>`;
    obj.src = extractedText;
  } else {
    // console.log('유효하지 않은 URL입니다.');
  }

  obj.cont = obj.cont.replace(/\$.*?\$/, '').trim();

  return obj;
};

let releases = ref(null);
let fetching = ref(true);

let getNews = () => {
  let cachedReleases = sessionStorage.getItem('releases');

  if (cachedReleases) {
    cachedReleases = JSON.parse(cachedReleases);
    releases.value = cachedReleases;
    fetching.value = false;
    console.log('session');
  } else {
    skapi.getNewsletters().then(async (r) => {
      releases.value = await Promise.all(r.list.map(crawl));
      sessionStorage.setItem('releases', JSON.stringify(releases.value));
      fetching.value = false;
      console.log('server');
    });
  }
};

export { fetching, releases, getNews };
