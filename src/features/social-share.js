export function initSocialShare(postTitle) {
  const currentUrl = window.location.href;
  const titleText = postTitle || document.title;

  const linkedinBtn = document.getElementById('share-linkedin');
  if (linkedinBtn) {
    linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  }

  const facebookBtn = document.getElementById('share-facebook');
  if (facebookBtn) {
    facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  }

  const twitterBtn = document.getElementById('share-twitter');
  if (twitterBtn) {
    twitterBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(titleText)}`;
  }
}
