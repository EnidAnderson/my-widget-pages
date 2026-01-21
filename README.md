# Dog Food Calculator Widget (GitHub Pages)

This repo deploys the widget to GitHub Pages on every push to `main`.

## Live URLs

After deployment, your URLs will be:

- https://EnidAnderson.github.io/my-widget-pages/
- https://EnidAnderson.github.io/my-widget-pages/embed.html
- https://EnidAnderson.github.io/my-widget-pages/body-condition-widget/

## Wix Embed

Iframe embed (recommended):

```html
<iframe src="https://EnidAnderson.github.io/my-widget-pages/embed.html" style="width:100%;height:600px;border:0;"></iframe>
```

Optional dynamic height (postMessage):

The embed page posts messages like `{ type: "WIDGET_HEIGHT", height: <number> }`. If your Wix page supports custom code, you can listen and resize the iframe.

```html
<script>
  window.addEventListener("message", function (event) {
    if (!event.data || event.data.type !== "WIDGET_HEIGHT") return;
    var iframe = document.getElementById("nd-widget");
    if (iframe) iframe.style.height = event.data.height + "px";
  });
</script>

<iframe
  id="nd-widget"
  src="https://EnidAnderson.github.io/my-widget-pages/embed.html"
  style="width:100%;height:600px;border:0;"
></iframe>
```

## How to update

Edit files → `git push` → GitHub Actions deploys automatically.
