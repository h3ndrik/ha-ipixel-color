#!/bin/bash

# LaTeX installation script for macOS using Homebrew
# This installs MacTeX (full LaTeX distribution)

echo "Installing LaTeX (MacTeX) via Homebrew..."
echo "Note: This is a large download (~4GB)"
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Error: Homebrew is not installed"
    echo "Please install Homebrew first: https://brew.sh"
    exit 1
fi

# Install MacTeX using Homebrew Cask
echo "Installing MacTeX..."
brew install --cask mactex

# Update PATH for current session
export PATH="/Library/TeX/texbin:$PATH"

# Verify installation
echo ""
echo "Verifying installation..."
if command -v pdflatex &> /dev/null; then
    echo "✓ pdflatex installed successfully"
    pdflatex --version | head -n 1
else
    echo "✗ pdflatex not found. You may need to:"
    echo "  1. Restart your terminal"
    echo "  2. Add /Library/TeX/texbin to your PATH"
fi

echo ""
echo "Installation complete!"
echo ""
echo "To compile the iPIXEL protocol documentation:"
echo "  cd ipixel-protocol-doc"
echo "  pdflatex main.tex"
echo "  bibtex main"
echo "  pdflatex main.tex"
echo "  pdflatex main.tex"
echo ""
echo "Note: Multiple pdflatex runs are needed to resolve cross-references."