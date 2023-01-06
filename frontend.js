// Stuff That I Had Trouble With
// - The API that I was using had no way of calling thumbnail images...found out later there's a roundabout way I could have gotten some image content...i used another API for metadata
// - icy.tools uses graphQL queries to make API requests. Luckily they had a query sandbox in their docs with some examples I could follow...you end up sending a post request with your query
// - I had a lot of trouble with event listeners in the carousel that I was loading content into from the API. there were a lot of moving parts. 
    //First you had to have the elements from the API
    //Second you had to have the elements loaded into the carousel via the library
    //Only after that did you have elements actually in the dom that you could attach to event listeners
    //Flickity has an initialization option you can set that helps with one problem I had called loadImages. The carousel wasn't adjusting to the images that were loading into it from the API. 
    //When you have loadImages set to true (not the default setting) it will hold off on creating dom elements until all the images are loaded, and then it'll create the 
    //carousel container that will be sized appropriately



const info = document.querySelector('#infoBox')
info.style.display = 'none'
const url = 'https://api.nftport.xyz/v0/contracts/top?page_size=10&page_number=1&period=24h&order_by=volume&chain=ethereum&chain=polygon';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: '16982f2e-2abf-4db3-bf5e-7c6533e87eff'
  }
};
fetch(url, options)
  .then(res => res.json())
  // .then(json => console.log(json))
  .then (json => {
    let i=0
    const arr = json.contracts
    // console.log(arr)
    const gal = document.querySelector('#gallery')
    while (i < arr.length){
      // console.log(i);
      let nftCell = document.createElement("div")    
      nftCell.className = 'carousel-cell'
      nftCell.setAttribute('name',arr[i].contract_address)
      let img = document.createElement('img')
      img.src = arr[i].metadata.thumbnail_url
      nftCell.append(img)
      let hidden = document.createElement("p")
      hidden.textContent = arr[i].metadata.description
      hidden.style.display = "none"
      nftCell.append(hidden)
      let nftCaption = document.createElement("p")
      nftCaption.textContent = arr[i].name
      nftCaption.style.display = 'none' 
      nftCell.append(nftCaption)
      gal.append(nftCell)
      // flkty.append(nftCell)
      i++
    }
  })
  .then( (result) =>{
    const elem = document.querySelector('.main-carousel')
    const flkty = new Flickity( elem, {
    contain: true,
    wrapAround: true,
    draggable: false,
    pageDots: false,
    imagesLoaded: true
    })
    flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {
      let address = cellElement.getAttribute('name')
      fetch('https://graphql.icy.tools/graphql', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query:
            `query CollectionStats($address: String!) {
              contract(address: $address) {
                ... on ERC721Contract {
                  stats(
                    timeRange: {
                      gte: "2022-01-01T00:00:00.000Z"
                      lt: "2022-01-07T00:00:00.000Z"
                    }
                  ) {
                  totalSales
                  average
                  floor
                  volume
                  }
                }
              }
            }`,
          variables: {"address":address}
        })
      })
      .then((res) => res.json())
      .then( json => {
      // console.log(json.data.contract.stats)
      let stats = json.data.contract.stats
      let empty = false
      document.getElementById('gallery').style.display = 'none'
      info.style.display = 'block'
      const thumb = document.querySelector('#thumb')
      const name = document.querySelector('#name')
      const desc = document.querySelector('#desc')  
      const vol = document.querySelector('#volume p') 
      const floor = document.querySelector('#floor p')
      const sales = document.querySelector('#sales p')
      const avg = document.querySelector('#average p')
      thumb.style.backgroundImage =`url(${cellElement.querySelector('img').src})`
      name.textContent = cellElement.querySelector('p:last-child').textContent
      desc.textContent = cellElement.querySelector('p').textContent
      // console.log(stats)
      for(stat in stats){
        if(stats[stat] === null){
          empty = true
          break
        }
      }
      if(empty === false){
        let statHeads = document.querySelectorAll('.statBox')
        console.log(statHeads)
        statHeads.forEach(statHead => {
          statHead.style.display = 'block'
        })
        vol.textContent = Math.floor(stats.volume).toString()
        floor.textContent = Math.floor(stats.floor).toString()
        sales.textContent = Math.floor(stats.totalSales).toString()
        avg.textContent = Math.floor(stats.average).toString()
        let nums = document.querySelectorAll('.statBox p:last-child')
        nums.forEach(num => {
          num.style.opacity = 0
          unfade(num)
        })
      }
      else{
        let statBoxes = document.querySelectorAll('.statBox')
        statBoxes.forEach(statBox => statBox.style.display = "none")
        let msg = document.createElement('p')
        msg.setAttribute('id', 'msg')
        msg.textContent = "We don't have current sales info for this NFT at the moment. Check back later."
        info.append(msg)
      }
      })
    })
  }) 
  .catch(err => console.error('error:' + err))   
  .then((results) => {
    let cells = document.querySelectorAll('.carousel-cell')
      cells.forEach(cell => {
        cell.addEventListener('mouseover', function(){
          if(cell.getAttribute('is') != 'hover'){
            cell.querySelector('img').style.display = 'none'
            cell.style.backgroundColor = 'navy'
            cell.style.border = '1px solid navy'
            cell.querySelector('p:last-child').style.cssText = 'display:block;margin 0 auto;margin-top:25%;'
            cell.setAttribute('is','hover')
          }
        })
        cell.addEventListener('mouseout', function(){
          if(cell.getAttribute('is') === 'hover'){
            cell.querySelector('img').style.display = 'block'
            cell.style.backgroundColor = 'white'
            cell.style.border = '1px solid cyan'
            cell.querySelector('p:last-child').style.display = 'none'
            cell.setAttribute('is','')
          }  
        })
      })
  })
  function closeStatBox(){
    let close = document.querySelector('#close')
    close.addEventListener('click', function(){
      if(close.style.display !== 'none'){
        if(document.querySelector('#thumb img')){
        document.querySelector('#thumb img').remove()
      }
      document.querySelector('#name').textContent = ''
      document.querySelector('#desc').textContent = ''
      let statBoxes = document.querySelectorAll('.statBox')
      statBoxes.forEach(statBox => {
        statBox.querySelector('p').textContent = ''
        console.log(statBox.querySelector('p').textContent)
      })
      if(document.querySelector('#msg')){
        document.querySelector('#msg').remove()
      }
        info.style.display = 'none'
        document.querySelector('#gallery').style.display = 'block'
      }  
    })
  }
  closeStatBox()
  function unfade(element) {
    var op = 0.05;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 50);
  } 

  // 16982f2e-2abf-4db3-bf5e-7c6533e87eff

