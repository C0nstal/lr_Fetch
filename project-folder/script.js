let isRequestInProgress = false;

async function fetchPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
  }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p><button onclick="deletePost(${post.id})">Удалить</button>`;
    postsContainer.appendChild(postElement);
  });
}

document.getElementById('create-post-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isRequestInProgress) return;

  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;

  isRequestInProgress = true;
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body })
    });
    const newPost = await response.json();
    displayNewPost(newPost);
  } catch (error) {
    console.error('Ошибка при создании поста:', error);
  } finally {
    isRequestInProgress = false;
  }
});

function displayNewPost(post) {
  const postsContainer = document.getElementById('posts-container');
  const postElement = document.createElement('div');
  postElement.className = 'post';
  postElement.id = `post-${post.id}`;
  postElement.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p><button onclick="deletePost(${post.id})">Удалить</button>`;
  postsContainer.appendChild(postElement);
}

async function deletePost(postId) {
  if (isRequestInProgress) return;

  isRequestInProgress = true;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      removePostFromDOM(postId);
    } else {
      console.error('Ошибка при удалении поста:', response.statusText);
    }
  } catch (error) {
    console.error('Ошибка при удалении поста:', error);
  } finally {
    isRequestInProgress = false;
  }
}

function removePostFromDOM(postId) {
  const postElement = document.getElementById(`post-${postId}`);
  if (postElement) {
    postElement.remove();
  }
}

document.addEventListener('DOMContentLoaded', fetchPosts);
