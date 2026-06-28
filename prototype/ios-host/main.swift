import UIKit
import WebKit

// Thin full-screen WKWebView host for the PetCare 24/7 prototype.
// Loads the local Vite dev server so the web app runs as an installed app
// (no Safari chrome) inside the iOS Simulator.

final class RootViewController: UIViewController, WKNavigationDelegate {
    private var webView: WKWebView!
    private let spinner = UIActivityIndicatorView(style: .large)
    private let urlString = "http://localhost:4321/"

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 0.98, green: 0.98, blue: 0.97, alpha: 1) // cream

        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = view.backgroundColor
        webView.scrollView.backgroundColor = view.backgroundColor
        webView.scrollView.bounces = false
        // let the web app paint under the notch / home indicator (env safe-area handles padding)
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        view.addSubview(webView)

        spinner.center = view.center
        spinner.color = UIColor(red: 0.23, green: 0.69, blue: 0.66, alpha: 1) // teal
        spinner.autoresizingMask = [.flexibleTopMargin, .flexibleBottomMargin, .flexibleLeftMargin, .flexibleRightMargin]
        spinner.startAnimating()
        view.addSubview(spinner)

        load()
    }

    private func load() {
        guard let url = URL(string: urlString) else { return }
        webView.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 15))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        spinner.stopAnimating()
        spinner.isHidden = true
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { retry() }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { retry() }

    // dev server may not be up the instant the app launches — retry briefly
    private func retry() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in self?.load() }
    }
}

final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = RootViewController()
        window?.makeKeyAndVisible()
        return true
    }
}

UIApplicationMain(CommandLine.argc, CommandLine.unsafeArgv,
                  nil, NSStringFromClass(AppDelegate.self))
