# Contributing

Thank you for contributing.

## Development Workflow

1. Fork repository
2. Create feature branch

```bash
git checkout -b feature/my-feature
```

3. Write code

4. Run

```bash
ruff check .
black .
mypy .
pytest
```

5. Commit

```bash
git commit
```

6. Push

7. Open Pull Request

## Coding Standards

- Python 3.14+
- Type hints mandatory
- Google docstrings
- Ruff clean
- Black formatted
- MyPy passing
- Tests required