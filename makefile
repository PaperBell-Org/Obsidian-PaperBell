# Sync PaperBell folder from Obsidian vault
# Replaces the current PaperBell folder with the one from Obsidian
sync-paperbell:
	@echo "Syncing PaperBell folder from Obsidian vault..."
	@if [ ! -d "/Users/songshgeo/Documents/Obsidian/PaperBell" ]; then \
		echo "Error: Source directory /Users/songshgeo/Documents/Obsidian/PaperBell does not exist"; \
		exit 1; \
	fi
	@if [ -d "PaperBell" ]; then \
		echo "Removing existing PaperBell folder..."; \
		rm -rf PaperBell; \
	fi
	@echo "Copying PaperBell folder from Obsidian vault..."; \
	cp -R /Users/songshgeo/Documents/Obsidian/PaperBell ./PaperBell
	@echo "PaperBell folder synced successfully!"
