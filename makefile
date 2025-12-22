# Load environment variables from .env file if it exists
-include .env

# Sync PaperBell folder from Obsidian vault
# Replaces the current PaperBell folder with the one from Obsidian
# Usage:
#   1. Create a .env file with: OBSIDIAN_PAPERBELL_PATH=/path/to/Obsidian/PaperBell
#   2. Or: make sync-paperbell OBSIDIAN_PAPERBELL_PATH=/path/to/Obsidian/PaperBell
#   3. Or: export OBSIDIAN_PAPERBELL_PATH=/path/to/Obsidian/PaperBell && make sync-paperbell
sync-paperbell:
	@if [ -z "$(OBSIDIAN_PAPERBELL_PATH)" ]; then \
		echo "Error: OBSIDIAN_PAPERBELL_PATH is not set"; \
		echo "Please set it as an environment variable or pass it as a make argument:"; \
		echo "  make sync-paperbell OBSIDIAN_PAPERBELL_PATH=/path/to/Obsidian/PaperBell"; \
		exit 1; \
	fi
	@echo "Syncing PaperBell folder from Obsidian vault..."
	@echo "Source path: $(OBSIDIAN_PAPERBELL_PATH)"
	@if [ ! -d "$(OBSIDIAN_PAPERBELL_PATH)" ]; then \
		echo "Error: Source directory $(OBSIDIAN_PAPERBELL_PATH) does not exist"; \
		exit 1; \
	fi
	@if [ -d "PaperBell" ]; then \
		echo "Removing existing PaperBell folder..."; \
		rm -rf PaperBell; \
	fi
	@echo "Copying PaperBell folder from Obsidian vault..."; \
	cp -R "$(OBSIDIAN_PAPERBELL_PATH)" ./PaperBell
	@echo "PaperBell folder synced successfully!"
