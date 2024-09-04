# @break/action

GitHub Action for generating Breakout animations from contribution graphs.

## Usage

```yaml
- uses: Cherninlab/break@v1
  with:
    github_user_name: ${{ github.repository_owner }}
    outputs: |
      dist/github-contribution-breek.svg
      dist/github-contribution-breek.gif
```

## Options

- `github_user_name`: GitHub username to generate the animation for
- `outputs`: List of output files (supports SVG and GIF)
- `colors`: Custom color scheme (optional)
- `animation_duration`: Duration of the animation in seconds (optional)

## Development

```bash
bun install
bun run build
bun run test
```
