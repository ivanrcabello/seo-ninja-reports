
/**
 * Debug utilities for SEO crawler API
 */

export function debugCrawlData(data: any) {
  if (!data) {
    console.log('Crawl data is null or undefined');
    return;
  }
  
  console.log('Crawl data keys:', Object.keys(data));
  // Log some specific fields for debugging
  console.log('Data structure sample:', {
    id: data.id,
    status: data.status,
    created_at: data.created_at,
    inserted_at: data.inserted_at,
    total_time_seconds: data.total_time_seconds
  });
}

export function debugIssuesData(data: any[]) {
  if (!data || !data.length) {
    console.log('Issues data is empty or null');
    return;
  }
  
  console.log(`Found ${data.length} issues`);
  if (data.length > 0) {
    console.log('First issue data keys:', Object.keys(data[0]));
    console.log('First issue sample:', {
      id: data[0].id,
      issue_type: data[0].issue_type,
      description: data[0].description,
      details: data[0].details,
      created_at: data[0].created_at
    });
  }
}

export function debugLinksData(data: any[]) {
  if (!data || !data.length) {
    console.log('Links data is empty or null');
    return;
  }
  
  console.log(`Found ${data.length} links`);
  if (data.length > 0) {
    console.log('First link data keys:', Object.keys(data[0]));
    console.log('First link sample:', {
      id: data[0].id,
      url: data[0].url,
      anchor_text: data[0].anchor_text,
      created_at: data[0].created_at
    });
  }
}

export function debugHeadingsData(data: any[]) {
  if (!data || !data.length) {
    console.log('Headings data is empty or null');
    return;
  }
  
  console.log(`Found ${data.length} headings`);
  if (data.length > 0) {
    console.log('First heading data keys:', Object.keys(data[0]));
    console.log('First heading sample:', {
      id: data[0].id,
      heading_type: data[0].heading_type,
      content: data[0].content,
      created_at: data[0].created_at
    });
  }
}
