const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');

// API URL
const apiURL = 'https://api.lyrics.ovh';

form.addEventListener('submit', handleFormSubmit);

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const searchValue = search.value.trim();

    if (!searchValue) {
        alert("Please enter an artist name or song title");
    } else {
        searchSong(searchValue);
    }
}

// Key up event listener
search.addEventListener('keyup', handleKeyUp);

// Handle key up event
function handleKeyUp() {
    const searchValue = search.value.trim();
    searchSong(searchValue);
}

// Search song 
async function searchSong(searchValue) {
    try {
        const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
        const data = await searchResult.json();
        showData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        result.innerHTML = '<p>An error occurred while fetching data. Please try again later.</p>';
    }
}

// Display search results
function showData(data) {
    result.innerHTML = `
        <ul class="song-list">
            ${data.data.map(song => `
                <li>
                    <div>
                        <strong>${song.artist.name}</strong> - ${song.title} 
                    </div>
                    <div class="button-container">
                        <button onclick="getLyrics('${song.artist.name}', '${song.title}')">Get lyrics</button>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    try {
        const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
        const data = await res.json();
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        displayLyrics(artist, songTitle, lyrics);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        result.innerHTML = '<p>An error occurred while fetching lyrics. Please try again later.</p>';
    }
}

// Display lyrics
function displayLyrics(artist, songTitle, lyrics) {
    result.innerHTML = `
        <h4 style="margin-bottom:30px;"><strong>${artist}</strong> - ${songTitle}</h4>
        <ul>
            <li><button onclick="searchSong(search.value.trim())">Back to results</button></li>
            <p style="margin-top:20px;">${lyrics}</p>
        </ul>
        <div id="video">
            <h2>YouTube Videos</h2>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/?listType=search&list=${encodeURIComponent(artist + ' ' + songTitle)}" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
}