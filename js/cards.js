const defaultPhoto = '../images/default.png';
const list = document.querySelector('.card-list');

const agentsFetch = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
        const data = await response.json();

        data.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            const photo = document.createElement('div');
            photo.classList.add('card-photo');

            const img = document.createElement('img');
            img.src = defaultPhoto;
            photo.appendChild(img);

            const title = document.createElement('h3');
            title.textContent = card.title;

            const body = document.createElement('p');
            body.textContent = card.body;

            cardDiv.appendChild(photo);
            cardDiv.appendChild(title);
            cardDiv.appendChild(body);

            list.appendChild(cardDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

agentsFetch();