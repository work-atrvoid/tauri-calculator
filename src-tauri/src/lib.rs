#[tauri::command]
fn calculate(
    a: f64,
    b: f64,
    operator: String,
) -> Result<f64, String> {
    match operator.as_str() {
        "+" => Ok(a + b),
        "-" => Ok(a - b),
        "*" => Ok(a * b),
        "/" => {
            if b == 0.0 {
                Err("Cannot divide by zero".into())
            } else {
                Ok(a / b)
            }
        }
        _ => Err("Invalid operator".into()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(
            tauri::generate_handler![calculate]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}