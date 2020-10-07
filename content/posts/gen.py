import lorem
for x in range(20):
    with open(f"article n{x}.md", "w") as f:
        print("---", file=f)
        print(f"title: article n{x}", file=f)
        print(f"description: {lorem.get_paragraph()}", file=f)
        print("author:", file=f)
        print("    name: flapili", file=f)
        print("    avatar: logo.webp", file=f)
        print(f"tags: {' '.join(lorem.get_word() for _ in range(5))}", file=f)
        print("---", file=f)

        print(lorem.get_paragraph(count=(2, 5)), file=f)
