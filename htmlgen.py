import tkinter as tk
from tkinter import ttk
from tkinter.scrolledtext import ScrolledText

class HTMLGeneratorApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("HTML Project Card Generator")
        self.setup_ui()

    def setup_ui(self):
        frame = ttk.Frame(self, padding=10)
        frame.grid(row=0, column=0, sticky="NSEW")

        labels = ["Image URL", "Project Title", "Description", "Tags (comma separated)", "GitHub URL", "Demo URL"]
        self.entries = {}

        for idx, text in enumerate(labels):
            lbl = ttk.Label(frame, text=text)
            lbl.grid(row=idx, column=0, sticky="W", pady=5)
            entry = ttk.Entry(frame, width=60)
            entry.grid(row=idx, column=1, pady=5, sticky="EW")
            self.entries[text] = entry

        # Generate button
        gen_btn = ttk.Button(frame, text="Generate HTML", command=self.generate_html)
        gen_btn.grid(row=len(labels), column=0, columnspan=2, pady=10)

        # Output box
        self.output = ScrolledText(frame, width=80, height=20)
        self.output.grid(row=len(labels)+1, column=0, columnspan=2, pady=5)

        frame.columnconfigure(1, weight=1)

    def generate_html(self):
        img_url = self.entries["Image URL"].get().strip()
        title = self.entries["Project Title"].get().strip()
        desc = self.entries["Description"].get().strip()
        tags = self.entries["Tags (comma separated)"].get().strip()
        github = self.entries["GitHub URL"].get().strip()
        demo = self.entries["Demo URL"].get().strip()

        tag_spans = "\n".join(f"              <span class=\"tag\">{t.strip()}</span>" for t in tags.split(",") if t.strip())

        html = f'''<div class="project-card">
    <div class="project-image">
      <img src="{img_url}" alt="{title} の画像">
    </div>
    <h3 class="project-title">{title}</h3>
    <p class="project-description">{desc}</p>

    <div class="project-tags">
{tag_spans}
    </div>

    <div class="project-links">
      <a href="{github}" target="_blank" class="project-link github-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub
      </a>
      <a href="{demo}" target="_blank" class="project-link demo-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        Demo
      </a>
    </div>
</div>'''
        self.output.delete("1.0", tk.END)
        self.output.insert(tk.END, html)

if __name__ == "__main__":
    app = HTMLGeneratorApp()
    app.mainloop()
