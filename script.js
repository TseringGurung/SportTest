const nbaTeamIds = {
    "Atlanta Hawks": "1",
    "Boston Celtics": "2",
    "Brooklyn Nets": "17",
    "Charlotte Hornets": "30",
    "Chicago Bulls": "4",
    "Cleveland Cavaliers": "5",
    "Dallas Mavericks": "6",
    "Denver Nuggets": "7",
    "Detroit Pistons": "8",
    "Golden State Warriors": "9",
    "Houston Rockets": "10",
    "Indiana Pacers": "11",
    "Los Angeles Clippers": "12",
    "Los Angeles Lakers": "13",
    "Memphis Grizzlies": "29",
    "Miami Heat": "14",
    "Milwaukee Bucks": "15",
    "Minnesota Timberwolves": "16",
    "New Orleans Pelicans": "3",
    "New York Knicks": "18",
    "Oklahoma City Thunder": "25",
    "Orlando Magic": "19",
    "Philadelphia 76ers": "20",
    "Phoenix Suns": "21",
    "Portland Trail Blazers": "22",
    "Sacramento Kings": "23",
    "San Antonio Spurs": "24",
    "Toronto Raptors": "28",
    "Utah Jazz": "26",
    "Washington Wizards": "27"
};
function getCurrentPageSport() {
    const path = window.location.pathname;
    if (path.includes('nba.html')) return 'NBA';
    if (path.includes('nfl.html')) return 'NFL';
    if (path.includes('mlb.html')) return 'MLB';
    if (path.includes('nhl.html')) return 'NHL';
    if (path.includes('ncaa-bb.html')) return 'College Basketball';
    if (path.includes('ncaa-fb.html')) return 'College Football';
    if (path.includes('NCAA-WBB.html')) return 'Womens College Basketball';
    if (path.includes('mls.html')) return 'Soccer';
    return null;
}

// Fetch and display NFL Scores
function fetchNFLScores() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('nfl-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NFL scores:', error);
            document.getElementById('nfl-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function nflshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = nflPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Function to close the popup
function closePopup() {
    const popup = document.getElementById('player-popup');
    popup.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable background scroll
}

// Fetch and display NFL Teams with detailed popup content
function fetchNFLTeams() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/football/nfl/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('nfl-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    nflshowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NFL teams:', error);
            document.getElementById('nfl-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}


// Fetch and display NFL News
function fetchNFLNews() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('nfl-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NFL news:', error);
            document.getElementById('nfl-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNFLScores();
    fetchNFLTeams();
    fetchNFLNews();
});


// Fetch and display MLB Scores
function fetchMLBScores() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('mlb-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching MLB scores:', error);
            document.getElementById('mlb-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function mlbshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = mlbPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}


// Fetch and display MLB Teams with detailed popup content
function fetchMLBTeams() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('mlb-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    mlbshowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching MLB teams:', error);
            document.getElementById('mlb-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}

// Fetch and display MLB News
function fetchMLBNews() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('mlb-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching MLB news:', error);
            document.getElementById('mlb-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchMLBScores();
    fetchMLBTeams();
    fetchMLBNews();
});

// Fetch and display NBA Scores
function fetchNBAScores() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('nba-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NBA scores:', error);
            document.getElementById('nba-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function nbashowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = nbaPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Fetch and display NBA Teams with detailed popup content
function fetchNBATeams() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('nba-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName); // Use the displayName for exact matching
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    nbashowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NBA teams:', error);
            document.getElementById('nba-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}

// Fetch and display NBA News
function fetchNBANews() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('nba-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NBA news:', error);
            document.getElementById('nba-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNBAScores();
    fetchNBATeams();
    fetchNBANews();
});

// Fetch and display WNBA Scores
function fetchWNBAScores() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('wnba-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching WNBA scores:', error);
            document.getElementById('wnba-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}


// Function to show the popup with team details
function wnbashowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = wnbaPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Function to fetch and display WNBA Teams
function fetchWNBATeams() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('wnba-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    wnbashowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching WNBA teams:', error);
            document.getElementById('wnba-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}

// Fetch and display WNBA News
function fetchWNBANews() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('wnba-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching WNBA news:', error);
            document.getElementById('wnba-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchWNBAScores();
    fetchWNBATeams();
    fetchWNBANews();
});

// Fetch and display NHL Scores
function fetchNHLScores() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('nhl-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NHL scores:', error);
            document.getElementById('nhl-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function nhlshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = nhlPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Fetch and display NHL Teams with detailed popup content
function fetchNHLTeams() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('nhl-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    nhlshowPopup(team.displayName, team.abbreviation, team.location, team.id);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NHL teams:', error);
            document.getElementById('nhl-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}


// Fetch and display NHL News
function fetchNHLNews() {
    fetch('http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('nhl-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching NHL news:', error);
            document.getElementById('nhl-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNHLScores();
    fetchNHLTeams();
    fetchNHLNews();
});

// Fetch and display Soccer Scores (Premier League)
function fetchSoccerScores() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('premier-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Soccer scores:', error);
            document.getElementById('soccer-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function premiershowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = premierPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Fetch and display Soccer Teams (Premier League) with detailed popup content
function fetchSoccerTeams() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('premier-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    premiershowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Soccer teams:', error);
            document.getElementById('premier-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}


// Fetch and display Soccer News (Premier League)
function fetchSoccerNews() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('premier-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Soccer news:', error);
            document.getElementById('soccer-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSoccerScores();
    fetchSoccerTeams();
    fetchSoccerNews();
});

// Fetch and display College Basketball Scores
function fetchCollegeBasketballScores() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('ncaa-bb-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching College Basketball scores:', error);
            document.getElementById('college-basketball-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function ncaabbshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    playerList.innerHTML = `
        <p>To see the full roster and details for ${teamName}, visit 
        <a href="https://www.espn.com/mens-college-basketball/teams" target="_blank" rel="noopener noreferrer">
            ESPN Men's College Basketball Teams
        </a>.</p>
    `;

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}


// Fetch and display College Basketball Teams with detailed popup content
function fetchCollegeBasketballTeams() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('ncaa-bb-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    ncaabbshowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching College Basketball teams:', error);
            document.getElementById('ncaa-bb-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}


// Fetch and display College Basketball News
function fetchCollegeBasketballNews() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('ncaa-bb-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching College Basketball news:', error);
            document.getElementById('college-basketball-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCollegeBasketballScores();
    fetchCollegeBasketballTeams();
    fetchCollegeBasketballNews();
});

// Fetch and display College Football Scores
function fetchCollegeFootballScores() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('ncaa-fb-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching College Football scores:', error);
            document.getElementById('ncaa-fb-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function ncaafbshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    playerList.innerHTML = `
        <p>To see the full roster and details for ${teamName}, visit 
        <a href="https://www.espn.com/college-football/teams" target="_blank" rel="noopener noreferrer">
            ESPN College Football Teams
        </a>.</p>
    `;


    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Fetch and display College Football Teams with detailed popup content
function fetchCollegeFootballTeams() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('ncaa-fb-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    ncaafbshowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching College Football teams:', error);
            document.getElementById('ncaa-fb-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}

// Fetch and display College Football News
function fetchCollegeFootballNews() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('ncaa-fb-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching College Football news:', error);
            document.getElementById('ncaa-fb-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCollegeFootballScores();
    fetchCollegeFootballTeams();
    fetchCollegeFootballNews();
});

// Fetch and display MLS Scores
function fetchMLSScores() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('mls-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score || '0'}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score || '0'}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching MLS scores:', error);
            document.getElementById('mls-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function mlsshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    // Clear any previous player data
    playerList.innerHTML = '';

    // Get players for the team from static data
    const players = mlsPlayerData[teamName];

    if (players && players.length > 0) {
        // Display each player in the list
        players.forEach(player => {
            const playerItem = document.createElement('li');
            playerItem.textContent = `${player.name} - Position: ${player.position}`;
            playerList.appendChild(playerItem);
        });
    } else {
        playerList.innerHTML = '<p>No players available for this team.</p>';
    }

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Fetch and display MLS Teams with detailed popup content
function fetchMLSTeams() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('mls-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    mlsshowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching MLS teams:', error);
            document.getElementById('mls-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}

// Fetch and display MLS News
function fetchMLSNews() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('mls-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching MLS news:', error);
            document.getElementById('mls-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Fetch all data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchMLSScores();
    fetchMLSTeams();
    fetchMLSNews();
});

// Fetch and display Women's College Basketball Scores
function fetchWomensCollegeBasketballScores() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard')
        .then(response => response.json())
        .then(data => {
            const scoresContainer = document.getElementById('ncaa-wbb-scores');
            const games = data.events;

            if (games.length === 0) {
                scoresContainer.innerHTML = "<p>No games available at this moment.</p>";
                return;
            }

            games.forEach(game => {
                const homeTeam = game.competitions[0].competitors[0];
                const awayTeam = game.competitions[0].competitors[1];
                const gameStatus = game.status.type.description;

                const gameDiv = document.createElement('div');
                gameDiv.classList.add('game');
                gameDiv.innerHTML = `
                    <h3>${homeTeam.team.displayName} vs ${awayTeam.team.displayName}</h3>
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score}</p>
                    <p>Status: ${gameStatus}</p>
                `;
                scoresContainer.appendChild(gameDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Women\'s College Basketball scores:', error);
            document.getElementById('womens-college-basketball-scores').innerHTML = "<p>Failed to load scores. Please try again later.</p>";
        });
}

// Function to show the popup with team details
function ncaawbbshowPopup(teamName, abbreviation, location) {
    const popup = document.getElementById('player-popup');
    const teamNameElement = document.getElementById('team-name');
    const playerList = document.getElementById('player-list');

    // Display basic team info
    teamNameElement.innerHTML = `
        <h2>${teamName}</h2>
        <p><strong>Abbreviation:</strong> ${abbreviation}</p>
        <p><strong>Location:</strong> ${location}</p>
        <h3>Players:</h3>
    `;

    playerList.innerHTML = `
        <p>To see the full roster and details for ${teamName}, visit 
        <a href="https://www.espn.com/womens-college-basketball/teams" target="_blank" rel="noopener noreferrer">
            ESPN Women's College Basketball Teams
        </a>.</p>
    `;

    // Display the popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

// Fetch and display Women's College Basketball Teams with detailed popup content
function fetchWomensCollegeBasketballTeams() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('ncaa-wbb-teams');
            const teams = data.sports[0].leagues[0].teams;

            teams.forEach((teamObj, index) => {
                const team = teamObj.team;

                // Create team element
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');
                teamDiv.setAttribute('data-team-name', team.displayName);
                teamDiv.innerHTML = `<strong>${index + 1}.</strong> ${team.displayName}`;

                // Attach click event listener to open the popup with team details
                teamDiv.addEventListener('click', () => {
                    ncaawbbshowPopup(team.displayName, team.abbreviation, team.location);
                });

                teamsContainer.appendChild(teamDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Women\'s College Basketball teams:', error);
            document.getElementById('ncaa-wbb-teams').innerHTML = "<p>Failed to load teams. Please try again later.</p>";
        });
}

// Fetch and display Women's College Basketball News
function fetchWomensCollegeBasketballNews() {
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/news')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('ncaa-wbb-news');
            const articles = data.articles;

            articles.forEach(article => {
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching Women\'s College Basketball news:', error);
            document.getElementById('womens-college-basketball-news').innerHTML = "<p>Failed to load news. Please try again later.</p>";
        });
}

// Call the functions to fetch Women's College Basketball data
document.addEventListener('DOMContentLoaded', () => {
    fetchWomensCollegeBasketballScores();
    fetchWomensCollegeBasketballTeams();
    fetchWomensCollegeBasketballNews();
});


var checkbox = document.getElementById('theme-toggle-checkbox');
var themeLabel = document.getElementById('theme-label');
var logo = document.getElementsByClassName('logo')[0]; 

if (localStorage.getItem('dark-mode') === 'enabled') {
  document.body.classList.add('dark-mode');
  checkbox.checked = true;
  themeLabel.textContent = 'Light Mode';
  themeLabel.style.color = '#f7f7f7'; 
  logo.style.color = '#f7f7f7'; 
} else {
  document.body.classList.add('light-mode');
  themeLabel.style.color = '#333'; 
}

document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('carousel');
    const body = document.body;

    const sportItems = document.querySelectorAll('.carousel-item');

    sportItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedSport = item.getAttribute('data-sport');
            body.setAttribute('data-background', selectedSport);
        });
    });

    /* Horizontal scrolling */
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Faster scroll
        carousel.scrollLeft = scrollLeft - walk;
    });
});

// Dark Mode Toggle
var checkbox = document.getElementById('theme-toggle-checkbox');
var themeLabel = document.getElementById('theme-label');
var logo = document.querySelector('.title'); // Assuming the title is used as the logo text

// Check if user has a preference saved in localStorage
if (localStorage.getItem('dark-mode') === 'enabled') {
  enableDarkMode();
} else {
  disableDarkMode();
}

// Add event listener to the checkbox
checkbox.addEventListener('change', function() {
  if (this.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// Function to enable dark mode
function enableDarkMode() {
  document.body.classList.add('dark-mode');
  document.body.classList.remove('light-mode');
  localStorage.setItem('dark-mode', 'enabled');
  themeLabel.textContent = 'Light Mode';
  themeLabel.style.color = '#f7f7f7'; // Ensure toggle label is white in dark mode
  logo.style.color = '#f7f7f7'; // Ensure logo is white in dark mode
}

// Function to disable dark mode
function disableDarkMode() {
  document.body.classList.add('light-mode');
  document.body.classList.remove('dark-mode');
  localStorage.setItem('dark-mode', 'disabled');
  themeLabel.textContent = 'Dark Mode';
  themeLabel.style.color = '#333'; // Ensure toggle label is dark in light mode
  logo.style.color = '#333'; // Ensure logo is dark in light mode
}

document.getElementById('search-bar').addEventListener('input', (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const teamElements = document.querySelectorAll('.team'); // Adjust selector based on your structure

    // Remove previous highlights and reset content
    teamElements.forEach((team) => {
        team.innerHTML = team.textContent; // Reset content to original team name
        team.classList.remove('highlight'); // Remove highlight class
    });

    // If searchQuery is empty, stop further execution
    if (!searchQuery) return;

    // Highlight matching teams and scroll to the first match
    let firstMatch = null;
    teamElements.forEach((team) => {
        const teamName = team.textContent;
        const lowerTeamName = teamName.toLowerCase();

        if (lowerTeamName.includes(searchQuery)) {
            const startIndex = lowerTeamName.indexOf(searchQuery);
            const endIndex = startIndex + searchQuery.length;

            // Split the team name into three parts: before, match, after
            const beforeMatch = teamName.slice(0, startIndex);
            const match = teamName.slice(startIndex, endIndex);
            const afterMatch = teamName.slice(endIndex);

            // Combine parts with <span> wrapping the matching part
            team.innerHTML = `${beforeMatch}<span class="highlight">${match}</span>${afterMatch}`;

            if (!firstMatch) {
                firstMatch = team; // Save the first matching element
            }
        }
    });

    // Scroll to the first match if it exists
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

function fetchPointsOverGamesWithPlayers(league, numberOfGames) {
    const leagueUrls = {
        'NBA': 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
        'WNBA': 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard',
        'NFL': 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
        'MLB': 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
        'NHL': 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
        'College Basketball': 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard',
        'College Football': 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard',
        'Women College BasketBall': 'https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard',
        'Soccer': 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
        'MLS': 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard'
    };

    const containerIds = {
        'NBA': 'nba-scores',
        'WNBA': 'wnba-scores',
        'NFL': 'nfl-scores',
        'MLB': 'mlb-scores',
        'NHL': 'nhl-scores',
        'College Basketball': 'ncaa-bb-scores',
        'College Football': 'ncaa-fb-scores',
        'Women College BasketBall': 'ncaa-wbb-scores',
        'Soccer': 'premier-scores',
        'MLS': 'mls-scores'
    };

    if (!leagueUrls[league]) {
        console.error("Invalid league specified:", league);
        return;
    }

    const containerId = containerIds[league];
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container ID not found in HTML:", containerId);
        return;
    }

    fetch(leagueUrls[league])
    .then(response => response.json())
    .then(data => {
        const games = data.events.slice(0, numberOfGames);

        // Clear the container before appending new content
        container.innerHTML = ""; 

        if (!games.length) {
            container.innerHTML = `<p>No games found for ${league}.</p>`;
            return;
        }

        const historyDiv = document.createElement('div');
        historyDiv.className = 'games-history';

        games.forEach(game => {
            const homeTeam = game.competitions[0].competitors[0];
            const awayTeam = game.competitions[0].competitors[1];
            const date = new Date(game.date).toLocaleString();
            const status = game.competitions[0].status.type.shortDetail || "N/A";
            const venue = game.competitions[0]?.venue?.fullName || "Unknown Venue";
            const homeRecord = homeTeam.records?.[0]?.summary || "N/A";
            const awayRecord = awayTeam.records?.[0]?.summary || "N/A";

            let winProbability = "Game is far from now";
            let winProbabilityPercentage = "Or Finished";

            if (game.competitions[0]?.odds) {
                const oddsDetails = game.competitions[0].odds[0].details; // e.g., "OKC -4.5"
                winProbability = oddsDetails || "N/A";

                // Calculate win probability if odds are valid
                const match = oddsDetails?.match(/(-?\d+(\.\d+)?)/);
                if (match) {
                    const spread = parseFloat(match[1]);
                    const probability = 1 / (1 + Math.pow(10, spread / 10));
                    winProbabilityPercentage = `${(probability * 100).toFixed(1)}%`;
                }
                if (league === "NHL") {
                    // NHL-specific moneyline conversion
                    winProbability = oddsDetails || "N/A";
                    const match = oddsDetails?.match(/(-?\d+(\.\d+)?)/);
                    if (match) {
                        const moneyline = parseFloat(match[1]);
                        if (moneyline < 0) {
                            winProbabilityPercentage = `${(((-moneyline) / (-moneyline + 100)) * 100).toFixed(1)}%`;
                        } else if (moneyline > 0) {
                            winProbabilityPercentage = `${((100 / (moneyline + 100)) * 100).toFixed(1)}%`;
                        }
                    }
                }
            }

            const gameDiv = document.createElement('div');
            gameDiv.className = 'game-history-item';
            gameDiv.innerHTML = `
                <div class="game-header">
                    <h3>${homeTeam.team.displayName} (${homeRecord}) vs ${awayTeam.team.displayName} (${awayRecord})</h3>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Venue:</strong> ${venue}</p>
                    <p><strong>Win Probability:</strong> ${winProbability} (${winProbabilityPercentage})</p>
                </div>
                <div class="game-score">
                    <h4>Scores:</h4> 
                    <p>${homeTeam.team.shortDisplayName}: ${homeTeam.score || '0'}</p>
                    <p>${awayTeam.team.shortDisplayName}: ${awayTeam.score || '0'}</p>
                </div>
            `;

            historyDiv.appendChild(gameDiv);
        });

        container.appendChild(historyDiv);
    })
    .catch(error => {
        console.error(`Error fetching data for ${league}:`, error);
        container.innerHTML = `<p>Failed to load ${league} games. Please try again later.</p>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchPointsOverGamesWithPlayers("NBA", 10);
    fetchPointsOverGamesWithPlayers("WNBA", 10);
    fetchPointsOverGamesWithPlayers("NFL", 10);
    fetchPointsOverGamesWithPlayers("MLB", 10);
    fetchPointsOverGamesWithPlayers("NHL", 10);
    fetchPointsOverGamesWithPlayers("College Basketball", 10);
    fetchPointsOverGamesWithPlayers("College Football", 10);
    fetchPointsOverGamesWithPlayers("Women College BasketBall", 10);
    fetchPointsOverGamesWithPlayers("Soccer", 10);
    fetchPointsOverGamesWithPlayers("MLS", 10);
});

// Function to fetch and compare historical matchup data
function fetchHeadToHeadStats(team1Name, team2Name, sport) {
    const team1Id = nbaTeamIds[team1Name];
    const team2Id = nbaTeamIds[team2Name];
    const statsContainer = document.getElementById('comparison-stats');
    const TODAY = new Date('2024-12-12'); // Set current date

    if (!statsContainer || !team1Id || !team2Id) {
        console.error('Missing required data');
        return;
    }

    statsContainer.innerHTML = '<div class="loading">Loading comparison data...</div>';

    Promise.all([
        fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/teams/${team1Id}/schedule?seasontype=2`),
        fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/teams/${team2Id}/schedule?seasontype=2`)
    ])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([team1Schedule, team2Schedule]) => {
            let allGames = [];
            console.log(team1Schedule, team2Schedule);
            // Process team1's schedule
            team1Schedule.events?.forEach(event => {
                if (event.competitions?.[0]?.competitors?.some(c => c.team?.id === team2Id)) {
                    allGames.push(event);
                }
            });

            // Sort games by date
            allGames.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Split into past and future games
            const pastGames = allGames.filter(game => new Date(game.date) < TODAY);
            const futureGames = allGames.filter(game => new Date(game.date) >= TODAY);

            let headToHeadDisplay = `
                <div class="comparison-container">
                    <h3 class="comparison-title">${team1Name} vs ${team2Name}</h3>
            `;

            // Display past games section
            if (pastGames.length > 0) {
                headToHeadDisplay += `
                    <div class="games-section">
                        <h4 class="section-title">Previous Games</h4>
                        <div class="games-grid">
                `;

                pastGames.forEach(game => {
                    const gameData = game.competitions[0];
                    const homeTeam = gameData.competitors[0];
                    const awayTeam = gameData.competitors[1];
                    const gameDate = new Date(game.date).toLocaleDateString();
                    const winner = homeTeam.winner ? homeTeam.team.displayName : awayTeam.team.displayName;

                    headToHeadDisplay += `
                        <div class="game-card past-game">
                            <div class="game-header">
                                <span class="game-date">${gameDate}</span>
                                <span class="game-status completed">Final</span>
                            </div>
                            <div class="teams-container">
                                <div class="team-row ${homeTeam.winner ? 'winner' : ''}">
                                    <span class="team-name">${homeTeam.team.displayName}</span>
                                    <span class="team-score">${homeTeam.score}</span>
                                </div>
                                <div class="team-row ${awayTeam.winner ? 'winner' : ''}">
                                    <span class="team-name">${awayTeam.team.displayName}</span>
                                    <span class="team-score">${awayTeam.score}</span>
                                </div>
                            </div>
                            <div class="game-details">
                                <div class="venue">Venue: ${gameData.venue?.fullName || 'N/A'}</div>
                                <div class="winner-text">Winner: ${winner}</div>
                            </div>
                        </div>
                    `;
                });

                headToHeadDisplay += `</div></div>`;
            }

            // Display future games section
            if (futureGames.length > 0) {
                headToHeadDisplay += `
                    <div class="games-section">
                        <h4 class="section-title">Upcoming Games</h4>
                        <div class="games-grid">
                `;

                futureGames.forEach(game => {
                    const gameData = game.competitions[0];
                    const homeTeam = gameData.competitors[0];
                    const awayTeam = gameData.competitors[1];
                    const gameDate = new Date(game.date).toLocaleDateString();
                    const broadcast = gameData.broadcasts?.[0]?.names?.join(', ') || 'TBD';

                    headToHeadDisplay += `
                        <div class="game-card future-game">
                            <div class="game-header">
                                <span class="game-date">${gameDate}</span>
                                <span class="game-status scheduled">Scheduled</span>
                            </div>
                            <div class="teams-container">
                                <div class="team-row">
                                    <span class="team-name">${homeTeam.team.displayName}</span>
                                    <span class="team-score">-</span>
                                </div>
                                <div class="team-row">
                                    <span class="team-name">${awayTeam.team.displayName}</span>
                                    <span class="team-score">-</span>
                                </div>
                            </div>
                            <div class="game-details">
                                <div class="venue">Venue: ${gameData.venue?.fullName || 'TBD'}</div>
                                <div class="broadcast">Broadcast: ${broadcast}</div>
                            </div>
                        </div>
                    `;
                });

                headToHeadDisplay += `</div></div>`;
            }

            headToHeadDisplay += `</div>`;
            statsContainer.innerHTML = headToHeadDisplay;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            statsContainer.innerHTML = '<div class="error">Unable to load comparison data</div>';
        });
}



function showTeamTrends(teamName, sport) {
    const teamId = nbaTeamIds[teamName];
    if (!teamId) {
        console.error('Team ID not found for:', teamName);
        return;
    }

    const trendsContainer = document.getElementById('team-trends');
    if (!trendsContainer) return;

    fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/teams/${teamId}/statistics`)
        .then(response => response.json())
        .then(data => {
            const generalStats = data.results?.stats?.categories.find(cat => cat.name === 'general')?.stats || [];
            const offensiveStats = data.results?.stats?.categories.find(cat => cat.name === 'offensive')?.stats || [];
            const defensiveStats = data.results?.stats?.categories.find(cat => cat.name === 'defensive')?.stats || [];

            let trendsHTML = `
                <div class="trends-container">
                    <h3>${teamName} Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-card team-overview">
                            <h4>Team Overview</h4>
                            <div class="key-stats">
                                <div>Record: ${data.team?.recordSummary || 'N/A'}</div>
                                <div>Standing: ${data.team?.standingSummary || 'N/A'}</div>
                                <div>Games Played: ${findStat(generalStats, 'gamesPlayed')}</div>
                                <div>Minutes Per Game: ${findStat(generalStats, 'avgMinutes')}</div>
                                <div>Assist/Turnover Ratio: ${findStat(generalStats, 'assistTurnoverRatio')}</div>
                            </div>
                        </div>
                        <div class="stat-card offensive-stats">
                            <h4>Offensive Stats</h4>
                            <div class="key-stats">
                                <div>Points Per Game: ${findStat(offensiveStats, 'avgPoints')}</div>
                                <div>Field Goal %: ${findStat(offensiveStats, 'fieldGoalPct')}</div>
                                <div>3-Point %: ${findStat(offensiveStats, 'threePointPct')}</div>
                                <div>Free Throw %: ${findStat(offensiveStats, 'freeThrowPct')}</div>
                                <div>Assists Per Game: ${findStat(offensiveStats, 'avgAssists')}</div>
                                <div>Turnovers Per Game: ${findStat(offensiveStats, 'avgTurnovers')}</div>
                            </div>
                        </div>
                        <div class="stat-card defensive-stats">
                            <h4>Defensive Stats</h4>
                            <div class="key-stats">
                                <div>Defensive Rebounds: ${findStat(defensiveStats, 'avgDefensiveRebounds')}</div>
                                <div>Blocks Per Game: ${findStat(defensiveStats, 'avgBlocks')}</div>
                                <div>Steals Per Game: ${findStat(defensiveStats, 'avgSteals')}</div>
                                <div>Total Rebounds: ${findStat(generalStats, 'avgRebounds')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            trendsContainer.innerHTML = trendsHTML;
        })
        .catch(error => {
            console.error('Error fetching team trends:', error);
            trendsContainer.innerHTML = '<p class="error">Unable to load team statistics at this time.</p>';
        });
}

// Helper function to find stat value
function findStat(stats, statName) {
    const stat = stats.find(s => s.name === statName);
    return stat ? stat.displayValue : 'N/A';
}

// Function to process and analyze team statistics
function processTeamStats(data) {
    // Process raw statistics into meaningful metrics
    return {
        pointsPerGame: calculateAverage(data.points),
        totalYards: calculateTotal(data.yards),
        pointsAllowed: calculateAverage(data.pointsAgainst),
        turnovers: data.turnovers,
        winPercentage: calculateWinPercentage(data.wins, data.games),
        streaks: analyzeStreaks(data.results)
    };
}

// Function to compare player performance
function comparePlayerStats(player1, player2, sport) {
    return fetch(`https://site.api.espn.com/apis/site/v2/sports/${sport}/athletes/${player1},${player2}/statistics`)
        .then(response => response.json())
        .then(data => {
            const playerComparisonDiv = document.createElement('div');
            playerComparisonDiv.className = 'player-comparison';
            
            const statsTable = createPlayerComparisonTable(data[0], data[1]);
            playerComparisonDiv.appendChild(statsTable);
            
            const container = document.getElementById('player-comparison-container');
            container.appendChild(playerComparisonDiv);
        })
        .catch(error => {
            console.error('Error comparing player stats:', error);
        });
}

// Event listeners for the comparison features
document.addEventListener('DOMContentLoaded', () => {
    initializeNBAComparisons();
});

function initializeNBAComparisons() {
    const team1Select = document.getElementById('team1-select');
    const team2Select = document.getElementById('team2-select');
    const compareBtn = document.getElementById('compare-btn');
    
    if (team1Select && team2Select) {
        // Clear existing options
        team1Select.innerHTML = '<option value="">Select First Team</option>';
        team2Select.innerHTML = '<option value="">Select Second Team</option>';
        
        // Add NBA teams
        Object.keys(nbaTeamIds).forEach(team => {
            team1Select.add(new Option(team, team));
            team2Select.add(new Option(team, team));
        });
    }

    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            const team1 = team1Select.value;
            const team2 = team2Select.value;
            
            if (team1 && team2) {
                fetchHeadToHeadStats(team1, team2, 'basketball/nba');
                showTeamTrends(team1, 'basketball/nba');
                showTeamTrends(team2, 'basketball/nba');
            }
        });
    }
}

function initializeComparisonControls() {
    const comparisonSection = document.querySelector('.section:last-of-type');
    if (comparisonSection) {
        const comparisonControls = createComparisonControls();
        comparisonSection.appendChild(comparisonControls);
        initializeComparison();
    }
}

function initializeNBAComparisons() {
    const team1Select = document.getElementById('team1-select');
    const team2Select = document.getElementById('team2-select');
    
    if (team1Select && team2Select) {
        // Clear existing options
        team1Select.innerHTML = '<option value="">Select First Team</option>';
        team2Select.innerHTML = '<option value="">Select Second Team</option>';
        
        // Add NBA teams
        Object.keys(nbaTeamIds).forEach(team => {
            team1Select.add(new Option(team, team));
            team2Select.add(new Option(team, team));
        });
    }
}

// Function to create comparison control elements
function createComparisonControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'comparison-controls';
    
    controlsDiv.innerHTML = `
        <div class="comparison-selector">
            <h3>Compare Teams</h3>
            <select id="team1-select" class="team-select">
                <option value="">Select Team 1</option>
            </select>
            <select id="team2-select" class="team-select">
                <option value="">Select Team 2</option>
            </select>
            <button id="compare-btn" class="compare-button">Compare</button>
        </div>
    `;
    
    return controlsDiv;
}

// Function to initialize comparison functionality
function initializeComparison() {
    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            const team1 = document.getElementById('team1-select').value;
            const team2 = document.getElementById('team2-select').value;
            
            if (team1 && team2) {
                fetchHeadToHeadStats(team1, team2, getCurrentSport());
                showTeamTrends(team1, getCurrentSport());
                showTeamTrends(team2, getCurrentSport());
            }
        });
    }
}

// Helper functions for calculations
function calculateAverage(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2);
}

function calculateTotal(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0);
}

function calculateWinPercentage(wins, totalGames) {
    if (!totalGames) return 0;
    return ((wins / totalGames) * 100).toFixed(1);
}

function analyzeStreaks(results) {
    if (!results || results.length === 0) return { current: 0, longest: 0 };
    let currentStreak = 1;
    let longestStreak = 1;
    for (let i = 1; i < results.length; i++) {
        if (results[i] === results[i - 1]) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    return { current: currentStreak, longest: longestStreak };
}

function getCurrentSport() {
    const path = window.location.pathname;
    if (path.includes('nba')) return 'basketball/nba';
    if (path.includes('nfl')) return 'football/nfl';
    if (path.includes('mlb')) return 'baseball/mlb';
    if (path.includes('nhl')) return 'hockey/nhl';
    return 'basketball/nba'; // default
}

function renderTrendCharts(stats) {
    // Basic chart rendering - you can enhance this as needed
    const charts = ['offense-chart', 'defense-chart'];
    charts.forEach(chartId => {
        const chart = document.getElementById(chartId);
        if (chart) {
            chart.innerHTML = `<div class="chart-placeholder">
                <p>Chart visualization for ${chartId}</p>
                <div class="chart-bar" style="width: ${Math.random() * 100}%"></div>
            </div>`;
        }
    });
}
