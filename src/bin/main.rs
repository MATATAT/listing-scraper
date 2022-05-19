use clap::Parser;
use epic_games_career_scraper::{
    config::Config, hits::Hits, job_client::JobClient, listing_state::ListingState, result::*,
};
use std::{fs, path::Path, process::exit};

#[derive(Debug, Parser)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[clap(short, long)]
    config: String,
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

    let fetched_hits = JobClient::new(config).request()?;

    let state = ListingState {
        new: Hits(Vec::new()),
        existing: Hits(Vec::new()),
        closed: Hits(Vec::new()),
    };
    let new_state = state.update(fetched_hits);
    println!("New State: {:?}", new_state);

    Ok(())
}

// TODO: State needs to be fetched from a document
// hits needs to be applied to the state
// State is written back out to document
