# breek

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)

Break your GitHub contribution graph.

<p align="center">
  <img width="600" src="https://raw.githubusercontent.com/Cherninlab/breek/output/github-contribution-breek.svg" alt="breek">
</p>

Generate a breakout animation from a GitHub user's contribution graph.

## Usage

### github action

Use this action on your profile README repository:

```yaml
- uses: Cherninlab/breek@v1
  with:
    github_user_name: ${{ github.repository_owner }}
    outputs: |
      dist/github-contribution-breek.svg
      dist/github-contribution-breek.gif
```

Then embed the generated image in your README:

```md
![breek](https://raw.githubusercontent.com/username/username/output/github-contribution-breek.svg)
```

## dev

```
bun install
bun run dev
open http://localhost:8080/
```

## roadmap

- [ ] Create an npx tool for local generation
- [ ] Add more customization options
- [ ] Improve performance for larger contribution graphs

## credits

Inspired by [Platane/snk](https://github.com/Platane/snk)

## license

MIT © [Cherninlab](https://github.com/Cherninlab)