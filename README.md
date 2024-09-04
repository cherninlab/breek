# 🕹️ breek

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)

Break your GitHub contribution graph.

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://raw.githubusercontent.com/cherninlab/breek/output/github-contribution-grid-breek-dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/cherninlab/breek/output/github-contribution-grid-breek.svg"
  />
  <img
    alt="github contribution grid breek animation"
    src="https://raw.githubusercontent.com/cherninlab/breek/output/github-contribution-grid-breek.svg"
  />
</picture>

Generate a breakout animation from a GitHub user's contribution graph.

## Usage

### GitHub Action

Use this action on your profile README repository:

```yaml
- uses: Cherninlab/breek@v1
  with:
    github_user_name: ${{ github.repository_owner }}
    svg_out_path: dist/github-contribution-grid-breek.svg
    svg_dark_out_path: dist/github-contribution-grid-breek-dark.svg
```

Then embed the generated image in your README using the `<picture>` tag for dark mode support:

```html
<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://raw.githubusercontent.com/ <Username> /output/github-contribution-grid-breek-dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/ <Username> /output/github-contribution-grid-breek.svg"
  />
  <img
    alt="github contribution grid breek animation"
    src="https://raw.githubusercontent.com/ <Userame> /output/github-contribution-grid-breek.svg"
  />
</picture>
```

### Interactive Demo

[cherninlab.github.io/breek](https://cherninlab.github.io/breek/)

### Local Development

```
bun install
bun run dev
```

Then open `http://localhost:5173` in your browser.

## Roadmap

- [ ] Create an npx tool for local generation
- [ ] Add more customization options

## Credits

Inspired by [Platane/snk](https://github.com/Platane/snk)

## License

MIT © [Cherninlab](https://github.com/Cherninlab)
