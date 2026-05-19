import json
import os
import subprocess
import sys
import time
from pathlib import Path


# Support both direct execution and when called from other directories
# Use environment variable override if set, otherwise detect from script location
if getattr(sys, 'frozen', False):
    # If bundled/compiled (PyInstaller, cx_Freeze, etc.)
    ROOT = Path(sys.executable).parent
else:
    # Relative to script location - works when running from any directory
    ROOT = Path(__file__).parent

# Allow override via environment variable for custom deployments
ROOT = Path(os.environ.get("OPENCODE_ROOT", ROOT))


def run_node(args):
    p = subprocess.run(
        ["node", *args],
        cwd=ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return p.returncode, p.stdout.strip(), p.stderr.strip()


def build_variant_css(tag):
    if tag == "button":
        return {
            1: "background:#dc2626;color:#fff;",
            2: "background:#ef4444;color:#fff;",
            3: "background:#991b1b;color:#fff;",
        }
    if tag == "h1":
        return {
            1: "color:#dc2626;letter-spacing:.2px;",
            2: "color:#b91c1c;text-transform:uppercase;letter-spacing:1px;",
            3: "color:#7f1d1d;font-style:italic;",
        }
    return {
        1: "outline:2px solid #dc2626;",
        2: "outline:2px solid #ef4444;",
        3: "outline:2px solid #991b1b;",
    }


def handle_generate(event):
    event_id = event.get("id")
    element = event.get("element") or {}
    tag = (element.get("tagName") or "div").lower()
    element_id = element.get("id")
    text = (element.get("textContent") or "").strip()

    wrap_args = [
        "skills/impeccable/scripts/live-wrap.mjs",
        "--id",
        event_id,
        "--count",
        str(event.get("count", 3)),
        "--tag",
        tag,
    ]
    if element_id:
        wrap_args += ["--element-id", element_id]
    if text:
        wrap_args += ["--text", text[:80]]

    rc, out, err = run_node(wrap_args)
    if rc != 0:
        run_node([
            "skills/impeccable/scripts/live-poll.mjs",
            "--reply",
            event_id,
            "error",
            "wrap_failed",
        ])
        return

    try:
        wrap = json.loads(out)
    except Exception:
        run_node([
            "skills/impeccable/scripts/live-poll.mjs",
            "--reply",
            event_id,
            "error",
            "wrap_output_invalid",
        ])
        return

    rel_file = wrap.get("file", "test-live/index.html").replace("\\", "/")
    file_path = ROOT / rel_file
    if not file_path.exists():
        run_node([
            "skills/impeccable/scripts/live-poll.mjs",
            "--reply",
            event_id,
            "error",
            "source_file_missing",
        ])
        return

    content = file_path.read_text(encoding="utf-8")
    marker = "<!-- Variants: insert below this line -->"
    if marker not in content:
        run_node([
            "skills/impeccable/scripts/live-poll.mjs",
            "--reply",
            event_id,
            "error",
            "variant_marker_missing",
        ])
        return

    base_html = f"<{tag}"
    if element_id:
        base_html += f' id="{element_id}"'
    base_html += f">{text or 'Variant'}</{tag}>"

    css_map = build_variant_css(tag)
    block = [
        "        <div data-impeccable-variant=\"1\" style=\"display: contents\">",
        f"          {base_html}",
        f"          <style data-impeccable-css=\"{event_id}\">",
        "            @scope ([data-impeccable-variant=\"1\"]) { :scope > * { " + css_map[1] + " } }",
        "            @scope ([data-impeccable-variant=\"2\"]) { :scope > * { " + css_map[2] + " } }",
        "            @scope ([data-impeccable-variant=\"3\"]) { :scope > * { " + css_map[3] + " } }",
        "          </style>",
        "        </div>",
        "        <div data-impeccable-variant=\"2\" style=\"display: contents\">",
        f"          {base_html}",
        "        </div>",
        "        <div data-impeccable-variant=\"3\" style=\"display: contents\">",
        f"          {base_html}",
        "        </div>",
    ]

    content = content.replace(marker, marker + "\n" + "\n".join(block), 1)
    file_path.write_text(content, encoding="utf-8")

    run_node([
        "skills/impeccable/scripts/live-poll.mjs",
        "--reply",
        event_id,
        "done",
        "--file",
        rel_file,
    ])


def main():
    while True:
        rc, out, err = run_node(["skills/impeccable/scripts/live-poll.mjs"])
        if rc != 0:
            time.sleep(0.5)
            continue
        if not out:
            time.sleep(0.2)
            continue
        try:
            event = json.loads(out)
        except Exception:
            time.sleep(0.2)
            continue

        et = event.get("type")
        if et == "generate":
            handle_generate(event)
        elif et == "exit":
            time.sleep(0.2)
        else:
            # accept/discard are handled by live-poll internals
            time.sleep(0.2)


if __name__ == "__main__":
    main()
