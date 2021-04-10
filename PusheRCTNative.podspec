require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "PusheRCTNative"
  s.version      = package["version"]
  s.summary      = "Pushe push-notification framework for react-native in iOS" # package["description"]
  s.description  = <<-DESC
                  react-native plugin for pushe iOS-sdk
                   DESC
  s.homepage     = "https://pushe.co"
  s.license        = package["license"]
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Jafar khoshtabiat" => "jafar.khoshtabiat@pushe.co" }
  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/pusheco/react-native-ios.git", :tag => "#{s.version}" }
  
  s.source_files = "ios/**/*.{h,m,swift}"
  s.static_framework = true

  s.dependency "React"
  s.dependency "Pushe", "1.0.16"
end

