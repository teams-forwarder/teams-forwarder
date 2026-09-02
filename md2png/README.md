# MD2PNG Converter

This is a markdown to PNG converter.

## Build

```bash
$ docker build . -t markdown2png:0.1
```

## Run

```bash
$ docker run -d -p 3000:3000 --name markdown2png markdown2png:0.1
```

## Convert

```bash
# the following command generates the img.png file with the markdown text send over the data body
$ curl -X POST -h 'Content-Type: text/markdown' -o img.png 'http://localhost:3000/render' -d 'My **markdown** reply.
* properly formatted
* generated locally'
```
