using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Pushe.Pushe
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class PusheModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="PusheModule"/>.
        /// </summary>
        internal PusheModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "Pushe";
            }
        }
    }
}
