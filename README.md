# 🕹️ breek

[![GitHub release](https://img.shields.io/github/release/cherninlab/breek.svg?style=flat-square)](https://github.com/cherninlab/breek/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-breek-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/generate-breakout-game-from-github-contribution-grid)
![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)

Break your GitHub contribution graph.

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://raw.githubusercontent.com/cherninlab/cherninlab/output/github-contribution-grid-breek-dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/cherninlab/cherninlab/output/github-contribution-grid-breek.svg"
  />
  <img
    alt="github contribution grid breek animation"
    src="https://raw.githubusercontent.com/cherninlab/breek/output/github-contribution-grid-breek.svg"
  />
</picture>

Generate a breakout animation from a GitHub user's contribution graph.

## Usage

### GitHub Action

Use this action in your workflow:

```yaml
- name: Generate Breek Animation
  uses: cherninlab/breek@v1.0.0
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
    srcset="https://raw.githubusercontent.com/<Username>/<Repository>/output/github-contribution-grid-breek-dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/<Username>/<Repository>/output/github-contribution-grid-breek.svg"
  />
  <img
    alt="github contribution grid breek animation"
    src="https://raw.githubusercontent.com/<Username>/<Repository>/output/github-contribution-grid-breek.svg"
  />
</picture>
```

Replace `<Username>` and `<Repository>` with your GitHub username and repository name respectively.

e.g. [demo workflow action](https://github.com/cherninlab/cherninlab/blob/main/.github/workflows/main.yml)
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
