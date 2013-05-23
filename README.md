# Scribe Analytics

Scribe Analytics is a client-side JavaScript library designed to capture all interaction data into a user-defined, pluggable back-end.

The driving philosophy behind Scribe Analytics is that you can't ask questions over data that you didn't capture.

So Scribe captures everything. All the time. With no custom coding required.

# Scope

Scribe Analytics tracks virtually every user interaction possible.

 * **Page views** &mdash; Every page view event is captured, together with 
   information on the browser, referrer, platform, and much more.
 * **Clicks** &mdash; Every click event will be captured, including information
   on the element that is clicked (id, title, data attributes, unique css 
   selector). If a link is clicked, then then information on the link target
   will be captured, as well.
 * **Engagements** &mdash; Every engagement with any HTML element in a document
   is captured, including information on the element (id, title, data 
   attributes, unique css selector). Engagement is defined as a mouseover 
   inside a certain time window (e.g. 1 and 20 seconds). Mouseovers outside
   the time window are not counted as engagements.
 * **Jumps** &mdash; Every jump (defined as navigation inside a page which 
   results in a change to the URL hash) is captured, including information on 
   the element that was jumped to (id, title, data attributes, unique css 
   selector).
 * **Forms** &mdash; All form interaction, including form abandonment and form
   submission, is captured, including details on all form fields that are not 
   marked as passwords. For this to work, the form must not be contained in an 
   iframe.
 * **Redirects** &mdash; Scribe will attempt to capture JavaScript redirects,
   but if the user is redirected to another site, and never returns, the 
   redirect may not be captured.

Scribe Analytics will capture clicks on links and form interaction even when 
those links and forms are added dynamically via JavaScript.

# Getting Started

 1. Include the Scribe Analytics module inside your HTML pages.
        <script type="application/javascript" src="scribe-analytics.js"></script>
 2. Create a new Scribe Analytics object, specifying the configuration options.
        var scribe = new Scribe({tracker: myTracker});
 3. That's all! If your website supports login, you should also use the 
    Scribe.identify() method. If you want to track custom events, you can use 
    Scribe.track().

When you create the Scribe Analytics object, you must specify the configuration 
options. These options are detailed in the [Configuration](#configuration) section.

# Configuration

When creating a Scribe Analytics object, the following options are supported:

 * **tracker** &mdash; The tracker to use for storing data. See [Trackers](#trackers) for more
   information on this option.

   This is a required field. There is no default.
 * **bucket** &mdash; Determines whether or not to include time information in the 
   path where events are stored. Must be equal to 'none', 'daily', 'monthly', 
   or 'yearly'. If you choose *monthly*, for example, then events will be 
   organized into paths that contain the year and month in which the event
   occurred (e.g. '/2013-12/').

   The default for this option is 'none'.
 * **breakoutUsers** &mdash; Determines whether or not to include user ID information
   in the path where events are stored. If you set this field to *true*, then 
   events for identified users will be organized into paths like '/users/123/',
   where 123 is a user ID.

   The default for this option is *false*.
 * **breakoutVisitors** &mdash; Determines whether or not to include visitor ID 
   information in the path where events are stored. If you set this field to
   *true*, then events for anonymous visitors will be organized into paths like
   '/visitors/123', where 123 is a visitor ID.

   The default for this option is *false*.

## Trackers

The only option required to create a Scribe object is a *tracker*. A 
tracker is a function which accepts an object of the following form:

    {
      "path":    (A String),
      "value":   (A JSON Value),
      "op":      (Either "replace" or "append"),
      "success": (A success callback),
      "failure": (A failure callback)
    }

The *path* field contains information on how the data should be organized. The 
*value* field contains the raw data to store. Finally, the *op* field denotes
whether the data should replace the existing data at that path, or append to the
data stored at that path.

The *success* and *failure* fields, if present, are functions that should be 
called on success or failure, respectively.

In most cases, you won't have to create your own tracker because you can use
one of the supplied integrations (see [Integrations](#integrations) below).

### Paths

In Scribe Analytics, all data is organized into directories. Depending on the
backend you are using, these directories might be mapped into collections,
databases, or physical directories.

# Integrations

Scribe Analytics contains a growing number of integrations. We welcome 
contributions from third-parties.

## Console

The Console integration merely dumps information to the console. It's primary
use case is debugging or exploring the capabilities of Scribe.

    <script type="text/javascript" src="scribe-console.js"></script>
    ...
    var scribe = new Scribe(new ScribeConsoleTracker());

## Precog

The Precog integration dumps all information into the [Precog analytics store](http://precog.com),
where it can then be analyzed by [Labcoat](http://labcoat.precog.com) or other tools.

    <script type="text/javascript" src="scribe-precog.js"></script>
    ...
    var scribe =  new Scribe(
                    new ScribePrecogTracker({
                      apiKey:           apiKey, 
                      analyticsService: analyticsServiceUrl,
                      rootPath:         rootPath
                    })
                  );

## Segment.IO

*Coming Soon* &mdash; The Segment IO integration can direct data to a variety of 
different backends, which can be configured on the Segment IO dashboard.

# License

    Copyright (c) 2013, Scribe Analytics Team
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      * Neither the name of the Scribe Analytics nor the
        names of its contributors may be used to endorse or promote products
        derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

