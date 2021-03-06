/*
 * JBoss, Home of Professional Open Source
 * Copyright 2015, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import org.infinispan.client.hotrod.configuration.*;
import org.infinispan.client.hotrod.*;
import java.util.logging.Logger;

/**
 * A simple REST service which proxies requests to a local datagrid.
 *
 * @author jfalkner@redhat.com
 *
 */

public class Main {
    private static final Logger LOGGER = Logger.getLogger("DGProxy");

    private RemoteCacheManager cacheManager;
    private RemoteCache<String, String> cache;

    public Main() {
        ConfigurationBuilder builder = new ConfigurationBuilder();
        builder.addServer()
              .host(getRemoteServerName())
              .port(getRemoteServerPort());
	LOGGER.info(builder.getClass() + ": " + builder);
        cacheManager = new RemoteCacheManager(builder.build());
        if(cacheManager.isStarted() == false) {
          cacheManager.start();
        }
        cache = cacheManager.getCache("default");
	LOGGER.info(cache.getClass() + ": " + cache.getName());
	cache.put("key", "my-value");
	LOGGER.info(cache.getClass() + ": get('key') = " + cache.get("key"));
    }

    public static void main(String[] args) {
      Main main = new Main();
      main.rhiotPut("key1", "value1");
      main.rhiotGet("key1");
    }

    public String rhiotGet(String id) {
	LOGGER.info("requesting '" + id + "'");
	String value = cache.get(id);
	LOGGER.info("for key '" + id + "' value is: " + value);
    	return value;
    }

    public void rhiotPut(String id, String value) {
	LOGGER.info("storing for key'" + id + "' value of: " + value);
	cache.put(id, value);

    }

    protected static final String REMOTE_SERVER_HOSTNAME="infinispan.client.hotrod.server.host";
    protected String getRemoteServerName() {
	String hostname = null;
	hostname = System.getProperty(REMOTE_SERVER_HOSTNAME);
	if (hostname == null) {
	    hostname = System.getenv("REMOTE_SERVER_NAME");
	}
	if (hostname == null) {
	    hostname = "localhost";
	}
	LOGGER.info("infinispan.client.hotrod.server.host/REMOTE_SERVER_NAME=" + hostname);
	return hostname;
    } 

    protected static final String REMOTE_SERVER_PORT="infinispan.client.hotrod.server.port";
    protected Integer getRemoteServerPort() {
	String port = null;
	port = System.getProperty(REMOTE_SERVER_PORT);
	if (port == null) {
	    port = System.getenv("REMOTE_SERVER_PORT");
	}
	if (port == null) {
	    port = "11422";
	}
	LOGGER.info("infinispan.client.hotrod.server.port/REMOTE_SERVER_PORT=" + port);
	return Integer.valueOf(port);
    } 
}
