use clap::Parser;
use epic_games_career_scraper::{client::Client, config::Config, result::*};
use std::{process::exit, path::Path, fs};

#[derive(Debug, Parser)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[clap(short, long)]
    config: String
}

fn main() {
    let args = Args::parse();
    let result = execute(args);

    match result {
        Ok(_) => println!("Scrape successful"),
        Err(e) => {
            eprintln!("Scrape failed: {}", e);
            exit(1);
        }
    }
}

fn execute(args: Args) -> Result<()> {
    let input_path = fs::canonicalize(Path::new(&args.config))?;
    let config = Config::from_json(input_path.as_path())?;

    Client::new(config).request()?;

    Ok(())
}
